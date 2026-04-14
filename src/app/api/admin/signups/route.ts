import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

// Gated by middleware.ts (HTTP Basic Auth)

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_STATUS = ["new", "contacted", "converted", "archived"];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "new";

  const supabase = getServerSupabase();
  let query = supabase
    .from("signups")
    .select("*")
    .order("created_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ signups: data });
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
  }

  if (typeof admin_notes === "string") {
    update.admin_notes = admin_notes.trim() || null;
  }

  if (Object.keys(update).length <= 2) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const supabase = getServerSupabase();
  const { error } = await supabase.from("signups").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
