import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

// Access to these routes is gated by middleware.ts (HTTP Basic Auth).
// If a request reaches here, the caller has already authenticated.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "pending";

  const supabase = getServerSupabase();
  let query = supabase
    .from("endorsements")
    .select("*")
    .order("created_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ endorsements: data });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.id !== "string" || typeof body.status !== "string") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const { id, status, zinger } = body as { id: string; status: string; zinger?: string };

  if (!["pending", "approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabase = getServerSupabase();
  const update: Record<string, unknown> = {
    status,
    reviewed_at: new Date().toISOString(),
    reviewed_by: "admin",
  };
  if (typeof zinger === "string" && zinger.trim()) {
    update.zinger = zinger.trim();
  }

  const { error } = await supabase
    .from("endorsements")
    .update(update)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
