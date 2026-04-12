import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, MAX_FEATURED } from "@/lib/supabase";

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
  if (!body || typeof body.id !== "string") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const { id, status, zinger, featured } = body as {
    id: string;
    status?: string;
    zinger?: string;
    featured?: boolean;
  };

  const supabase = getServerSupabase();
  const update: Record<string, unknown> = {
    reviewed_at: new Date().toISOString(),
    reviewed_by: "admin",
  };

  // ── Status change ─────────────────────────────────────
  if (typeof status === "string") {
    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    update.status = status;
    // If it's being unapproved, remove featured flag automatically
    if (status !== "approved") {
      update.featured = false;
      update.featured_at = null;
    }
  }

  // ── Zinger edit ───────────────────────────────────────
  if (typeof zinger === "string" && zinger.trim()) {
    update.zinger = zinger.trim();
  }

  // ── Featured toggle — enforce 3-item cap & approved-only ──
  if (typeof featured === "boolean") {
    if (featured) {
      // Verify target is approved
      const { data: row, error: rowErr } = await supabase
        .from("endorsements")
        .select("status, featured")
        .eq("id", id)
        .single();
      if (rowErr || !row) {
        return NextResponse.json({ error: "Endorsement not found" }, { status: 404 });
      }
      // Check desired status too — if status is being set in this same call use that
      const willBeApproved = (update.status ?? row.status) === "approved";
      if (!willBeApproved) {
        return NextResponse.json(
          { error: "Only approved endorsements can be featured." },
          { status: 400 }
        );
      }
      // Enforce cap
      if (!row.featured) {
        const { count, error: countErr } = await supabase
          .from("endorsements")
          .select("id", { count: "exact", head: true })
          .eq("featured", true);
        if (countErr) {
          return NextResponse.json({ error: countErr.message }, { status: 500 });
        }
        if ((count ?? 0) >= MAX_FEATURED) {
          return NextResponse.json(
            {
              error: `You already have ${MAX_FEATURED} featured endorsements. Unfeature one first.`,
            },
            { status: 409 }
          );
        }
      }
      update.featured = true;
      update.featured_at = new Date().toISOString();
    } else {
      update.featured = false;
      update.featured_at = null;
    }
  }

  // ── Nothing to update? ─────────────────────────────────
  if (Object.keys(update).length <= 2) {
    // (only reviewed_at + reviewed_by got set — no real change)
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { error } = await supabase
    .from("endorsements")
    .update(update)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
