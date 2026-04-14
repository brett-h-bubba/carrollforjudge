import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import type { SignupInterest } from "@/lib/supabase";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SubmitBody {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  address?: string | null;
  interests?: string[];
  message?: string | null;
}

const VALID_INTERESTS: SignupInterest[] = [
  "volunteer",
  "yard_sign",
  "host_event",
  "updates",
];

const INTEREST_LABELS: Record<SignupInterest, string> = {
  volunteer: "Volunteer",
  yard_sign: "Yard Sign",
  host_event: "Host an Event",
  updates: "Receive Updates",
};

function bad(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}

export async function POST(req: NextRequest) {
  let body: SubmitBody;
  try {
    body = await req.json();
  } catch {
    return bad(400, "Invalid JSON body.");
  }

  const firstName = (body.firstName || "").trim();
  const lastName = (body.lastName || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim() || null;
  const address = (body.address || "").trim() || null;
  const message = (body.message || "").trim() || null;

  if (!firstName) return bad(400, "Please provide your first name.");
  if (!lastName) return bad(400, "Please provide your last name.");
  if (!email || !/^\S+@\S+\.\S+$/.test(email))
    return bad(400, "Please provide a valid email address.");

  const interests: SignupInterest[] = (body.interests || [])
    .filter((i): i is SignupInterest =>
      VALID_INTERESTS.includes(i as SignupInterest)
    );

  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("signups")
    .insert({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address,
      interests,
      message,
      status: "new",
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[get-involved] Supabase insert failed:", error);
    return bad(500, "Could not save your signup. Please try again.");
  }

  // Admin email alert (non-blocking)
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const resendKey = process.env.RESEND_API_KEY;
  if (adminEmails.length > 0 && resendKey) {
    try {
      const resend = new Resend(resendKey);
      const interestList =
        interests.length > 0
          ? interests.map((i) => INTEREST_LABELS[i]).join(", ")
          : "(none specified)";
      await resend.emails.send({
        from: "Carroll for Judge <signups@carrollforjudge.com>",
        to: adminEmails,
        subject: `New signup: ${firstName} ${lastName}`,
        text: [
          `Name: ${firstName} ${lastName}`,
          `Email: ${email}`,
          phone ? `Phone: ${phone}` : null,
          address ? `Address: ${address}` : null,
          `Interests: ${interestList}`,
          ``,
          message ? `--- Message ---` : null,
          message,
          ``,
          `Review at: ${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/signups`,
        ]
          .filter(Boolean)
          .join("\n"),
      });
    } catch (err) {
      console.error("[get-involved] Admin email failed (non-fatal):", err);
    }
  }

  return NextResponse.json({ ok: true, id: data.id });
}
