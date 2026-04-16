import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import type { SignupInterest } from "@/lib/supabase";
import { sendAdminMail, getAdminEmails } from "@/lib/mailer";
import { honeypotTriggered, rateLimit, clientIp } from "@/lib/spam-protection";

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
  let body: SubmitBody & Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return bad(400, "Invalid JSON body.");
  }

  // Honeypot: silently accept to avoid tipping off bots.
  if (honeypotTriggered(body)) {
    return NextResponse.json({ id: "ok" });
  }

  // Rate limit: 5 submissions / 10 min per IP.
  const rl = rateLimit(`signup:${clientIp(req)}`);
  if (!rl.ok) return bad(429, "Too many submissions. Please try again later.");

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

  // Admin email alert (non-blocking, via Gmail SMTP)
  const adminEmails = getAdminEmails();
  if (adminEmails.length > 0) {
    const interestList =
      interests.length > 0
        ? interests.map((i) => INTEREST_LABELS[i]).join(", ")
        : "(none specified)";
    const reviewUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.carrollforjudge.com"}/admin/signups`;
    const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const fullName = `${firstName} ${lastName}`;

      const plainText = [
        `Name: ${fullName}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        address ? `Address: ${address}` : null,
        `Interests: ${interestList}`,
        ``,
        message ? `--- Message ---` : null,
        message,
        ``,
        `Review: ${reviewUrl}`,
        ``,
        `Reply to this email to respond directly to ${fullName} (${email}).`,
        `--`,
        `Friends of Keri H. Carroll · carrollforjudge.com`,
      ]
        .filter(Boolean)
        .join("\n");

      const interestChips =
        interests.length > 0
          ? interests
              .map(
                (i) =>
                  `<span style="display:inline-block;padding:4px 10px;margin:0 4px 4px 0;background:#f7f1e8;border:1px solid #b08a49;color:#215b64;font-size:12px;font-weight:600;">${esc(INTEREST_LABELS[i])}</span>`
              )
              .join("")
          : `<span style="color:#9ca3af;font-style:italic;">(none specified)</span>`;

      const html = `<!doctype html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a;background:#ffffff;">
  <div style="border-bottom:2px solid #b08a49;padding-bottom:12px;margin-bottom:20px;">
    <p style="margin:0;font-size:11px;color:#b08a49;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Carroll for Judge · Admin Notification</p>
    <h1 style="margin:6px 0 0;font-size:20px;color:#215b64;font-weight:600;">New signup received</h1>
  </div>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    <tr><td style="padding:6px 0;color:#6b7280;width:110px;">Name</td><td style="padding:6px 0;"><strong>${esc(fullName)}</strong></td></tr>
    <tr><td style="padding:6px 0;color:#6b7280;">Email</td><td style="padding:6px 0;"><a href="mailto:${esc(email)}" style="color:#215b64;">${esc(email)}</a></td></tr>
    ${phone ? `<tr><td style="padding:6px 0;color:#6b7280;">Phone</td><td style="padding:6px 0;"><a href="tel:${esc(phone)}" style="color:#215b64;">${esc(phone)}</a></td></tr>` : ""}
    ${address ? `<tr><td style="padding:6px 0;color:#6b7280;vertical-align:top;">Address</td><td style="padding:6px 0;white-space:pre-line;">${esc(address)}</td></tr>` : ""}
  </table>
  <p style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin:20px 0 8px;font-weight:600;">Interested in</p>
  <div>${interestChips}</div>
  ${message ? `
  <p style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin:20px 0 8px;font-weight:600;">Message</p>
  <div style="padding:12px 14px;background:#f7f1e8;border-left:3px solid #b08a49;white-space:pre-line;font-size:14px;line-height:1.6;">${esc(message)}</div>` : ""}
  <div style="margin-top:28px;padding-top:16px;border-top:1px solid #e5e7eb;">
    <a href="${reviewUrl}" style="display:inline-block;padding:10px 20px;background:#215b64;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;">Review in admin &rarr;</a>
  </div>
  <p style="margin-top:28px;font-size:11px;color:#9ca3af;line-height:1.5;">
    Hit reply to respond directly to ${esc(fullName)} (${esc(email)}).<br/>
    Friends of Keri H. Carroll &middot; <a href="https://www.carrollforjudge.com" style="color:#9ca3af;">carrollforjudge.com</a>
  </p>
</body></html>`;

    await sendAdminMail({
      to: adminEmails,
      replyTo: email,
      subject: `New signup: ${fullName}`,
      text: plainText,
      html,
      headers: {
        "X-Entity-Ref-ID": `signup-${data?.id || "unknown"}`,
      },
    });
  }

  return NextResponse.json({ ok: true, id: data.id });
}
