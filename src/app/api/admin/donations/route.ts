import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

// Gated by middleware.ts (HTTP Basic Auth)

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_STATUS = ["new", "acknowledged", "flagged", "archived"];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "new";

  const supabase = getServerSupabase();
  let query = supabase
    .from("donations")
    .select("*")
    .order("donated_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Aggregate totals for header display
  const totalsQuery = await supabase
    .from("donations")
    .select("amount_dollars, status");
  const all = totalsQuery.data || [];
  const totals = {
    count: all.length,
    sum: all.reduce((acc: number, d: { amount_dollars: number | null }) => acc + (d.amount_dollars ?? 0), 0),
    new_count: all.filter((d: { status: string }) => d.status === "new").length,
  };

  return NextResponse.json({ donations: data, totals });
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
  const { error } = await supabase.from("donations").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
