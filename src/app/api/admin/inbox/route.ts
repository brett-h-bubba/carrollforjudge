import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { Resend } from "resend";

// Gated by middleware.ts (HTTP Basic Auth)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_STATUS = ["new", "read", "replied", "archived", "spam"];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "new";
  const id = searchParams.get("id");

  const supabase = getServerSupabase();

  // Detail fetch (single email)
  if (id) {
    const { data, error } = await supabase
      .from("inbound_emails")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 404 });

    // Lazy body fetch: if not yet fetched, call Resend API
    if (!data.body_fetched && data.resend_email_id && process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        // Resend SDK may not have a typed getter for inbound emails as of 6.10
        // Use a direct fetch to the REST endpoint for reliability.
        const resp = await fetch(
          `https://api.resend.com/emails/${data.resend_email_id}`,
          { headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` } },
        );
        if (resp.ok) {
          const full = (await resp.json()) as {
            html?: string;
            text?: string;
            headers?: Record<string, string>;
          };
          await supabase
            .from("inbound_emails")
            .update({
              html: full.html ?? null,
              text: full.text ?? null,
              headers: full.headers ?? null,
              body_fetched: true,
            })
            .eq("id", data.id);
          data.html = full.html ?? null;
          data.text = full.text ?? null;
          data.headers = full.headers ?? null;
          data.body_fetched = true;
        }
        // Silence unused-var warning for the initialized client
        void resend;
      } catch (err) {
        console.error("[admin/inbox] Body fetch failed:", err);
      }
    }

    const { data: attachments } = await supabase
      .from("inbound_email_attachments")
      .select("*")
      .eq("inbound_email_id", id);

    return NextResponse.json({ email: data, attachments: attachments ?? [] });
  }

  // List view
  let query = supabase
    .from("inbound_emails")
    .select("*")
    .order("received_at", { ascending: false });
  if (status !== "all") query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ emails: data });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.id !== "string") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const { id, status, admin_notes } = body as {
    id: string;
    status?: string;
    admin_notes?: string;
  };

  const update: Record<string, unknown> = {
    reviewed_at: new Date().toISOString(),
    reviewed_by: "admin",
  };
  if (typeof status === "string") {
    if (!VALID_STATUS.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    update.status = status;
    if (status === "read") update.read_at = new Date().toISOString();
  }
  if (typeof admin_notes === "string") update.admin_notes = admin_notes.trim() || null;
  if (Object.keys(update).length <= 2) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const supabase = getServerSupabase();
  const { error } = await supabase.from("inbound_emails").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
