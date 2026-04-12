import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { headlineForCategory } from "@/lib/ai";
import type { EndorsementCategory } from "@/lib/supabase";

export const runtime = "nodejs";

// Brand colors
const TEAL = "#215b64";
const TEAL_DARK = "#17434a";
const GOLD = "#b08a49";
const CREAM = "#f7f1e8";
const INK = "#1a1a1a";

type Format = "square" | "story" | "linkedin";

const DIMS: Record<Format, { w: number; h: number }> = {
  square:   { w: 1080, h: 1080 },
  story:    { w: 1080, h: 1920 },
  linkedin: { w: 1584, h:  396 },
};

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const { searchParams } = new URL(req.url);
  const format = (searchParams.get("format") || "square") as Format;
  const dims = DIMS[format] || DIMS.square;

  // Fetch endorsement
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("endorsements")
    .select("name, location, zinger, category")
    .eq("id", id)
    .single();

  if (error || !data) {
    return new Response("Not found", { status: 404 });
  }

  const headline = headlineForCategory((data.category || "other") as EndorsementCategory);
  const zinger = data.zinger || "I'm with Keri.";
  const attribution = data.location ? `${data.name} · ${data.location}` : data.name;

  // Load fonts
  const [cormorantBold, cormorantRegular, allura] = await Promise.all([
    fetch(
      "https://fonts.gstatic.com/s/cormorantgaramond/v16/co3YmX5slCNuHLi8bLeY9MK7whWMhyjYrEPjuw.ttf"
    ).then((r) => r.arrayBuffer()),
    fetch(
      "https://fonts.gstatic.com/s/cormorantgaramond/v16/co3bmX5slCNuHLi8bLeY9MK7whWMhyjQAllvuQ.ttf"
    ).then((r) => r.arrayBuffer()),
    fetch(
      "https://fonts.gstatic.com/s/allura/v21/9oRPNYsQpSyG3Sz6ckRhXoA7.ttf"
    ).then((r) => r.arrayBuffer()),
  ]);

  // Choose layout by format
  let body: React.ReactElement;
  if (format === "linkedin") {
    body = <LinkedinBanner headline={headline} zinger={zinger} attribution={attribution} />;
  } else if (format === "story") {
    body = <StoryTall headline={headline} zinger={zinger} attribution={attribution} />;
  } else {
    body = <Square headline={headline} zinger={zinger} attribution={attribution} />;
  }

  return new ImageResponse(body, {
    width:  dims.w,
    height: dims.h,
    fonts: [
      { name: "Cormorant", data: cormorantRegular, weight: 400, style: "normal" },
      { name: "Cormorant", data: cormorantBold,    weight: 700, style: "normal" },
      { name: "Allura",    data: allura,           weight: 400, style: "normal" },
    ],
  });
}

// ───────────────────────────────────────────────────────────────
// Layout: 1080 × 1080 square (Instagram / FB post)
// ───────────────────────────────────────────────────────────────
function Square({ headline, zinger, attribution }: LayoutProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: CREAM,
        padding: 72,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "Cormorant",
        color: INK,
      }}
    >
      {/* Border frame */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 28,
          right: 28,
          bottom: 28,
          border: `2px solid ${GOLD}`,
          display: "flex",
        }}
      />

      {/* Top */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 120, color: GOLD, lineHeight: 1, fontWeight: 700, fontStyle: "italic" }}>
          &ldquo;
        </div>
        <div
          style={{
            fontSize: 72,
            color: TEAL,
            fontWeight: 700,
            letterSpacing: "0.03em",
            lineHeight: 1.1,
            marginTop: -40,
          }}
        >
          {headline}
        </div>
        <div style={{ width: 140, height: 4, background: GOLD, marginTop: 24 }} />
      </div>

      {/* Middle: zinger */}
      <div
        style={{
          fontSize: 54,
          color: INK,
          lineHeight: 1.25,
          fontStyle: "italic",
          fontWeight: 400,
          display: "flex",
        }}
      >
        &ldquo;{zinger}&rdquo;
      </div>

      {/* Bottom: attribution + campaign */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 32, color: TEAL, fontWeight: 700, letterSpacing: "0.05em" }}>
          &mdash; {attribution}
        </div>
        <div style={{ width: "100%", height: 1, background: GOLD, opacity: 0.4, margin: "28px 0 24px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 40, fontFamily: "Allura", color: GOLD, lineHeight: 1 }}>
              Keri H. Carroll
            </div>
            <div style={{ fontSize: 22, color: TEAL, fontWeight: 700, letterSpacing: "0.25em", marginTop: 4 }}>
              CHANCERY COURT JUDGE
            </div>
          </div>
          <div style={{ fontSize: 20, color: TEAL, fontWeight: 700, letterSpacing: "0.2em", textAlign: "right" }}>
            VOTE NOVEMBER 3, 2026
            <div style={{ fontSize: 14, color: GOLD, marginTop: 6, letterSpacing: "0.2em" }}>
              CARROLLFORJUDGE.COM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Layout: 1080 × 1920 story (IG / FB story)
// ───────────────────────────────────────────────────────────────
function StoryTall({ headline, zinger, attribution }: LayoutProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: TEAL_DARK,
        padding: 80,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "Cormorant",
        color: CREAM,
        position: "relative",
      }}
    >
      {/* Top band */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 36, color: GOLD, fontWeight: 700, letterSpacing: "0.3em" }}>
          ENDORSEMENT
        </div>
        <div style={{ width: 160, height: 4, background: GOLD, marginTop: 20 }} />
      </div>

      {/* Middle: headline + zinger */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 110,
            color: GOLD,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "0.02em",
          }}
        >
          {headline}
        </div>
        <div style={{ width: 140, height: 4, background: CREAM, marginTop: 36, marginBottom: 48 }} />
        <div
          style={{
            fontSize: 72,
            color: CREAM,
            lineHeight: 1.25,
            fontStyle: "italic",
            fontWeight: 400,
            display: "flex",
          }}
        >
          &ldquo;{zinger}&rdquo;
        </div>
        <div
          style={{
            fontSize: 40,
            color: GOLD,
            fontWeight: 700,
            letterSpacing: "0.05em",
            marginTop: 48,
          }}
        >
          &mdash; {attribution}
        </div>
      </div>

      {/* Bottom: campaign */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div style={{ width: "100%", height: 1, background: GOLD, opacity: 0.4, marginBottom: 32 }} />
        <div style={{ fontSize: 80, fontFamily: "Allura", color: GOLD, lineHeight: 1 }}>
          Keri H. Carroll
        </div>
        <div style={{ fontSize: 30, color: CREAM, fontWeight: 700, letterSpacing: "0.3em", marginTop: 12 }}>
          CHANCERY COURT JUDGE
        </div>
        <div style={{ fontSize: 24, color: GOLD, letterSpacing: "0.3em", marginTop: 24 }}>
          VOTE NOVEMBER 3, 2026
        </div>
        <div style={{ fontSize: 18, color: CREAM, opacity: 0.7, letterSpacing: "0.3em", marginTop: 16 }}>
          CARROLLFORJUDGE.COM
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Layout: 1584 × 396 LinkedIn banner
// ───────────────────────────────────────────────────────────────
function LinkedinBanner({ headline, zinger, attribution }: LayoutProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: CREAM,
        display: "flex",
        fontFamily: "Cormorant",
      }}
    >
      {/* Left teal panel */}
      <div
        style={{
          width: 520,
          height: "100%",
          background: TEAL_DARK,
          padding: "40px 48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          color: CREAM,
        }}
      >
        <div style={{ fontSize: 18, color: GOLD, fontWeight: 700, letterSpacing: "0.35em" }}>
          ENDORSEMENT
        </div>
        <div style={{ width: 80, height: 3, background: GOLD, marginTop: 14, marginBottom: 18 }} />
        <div
          style={{
            fontSize: 56,
            color: CREAM,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "0.02em",
          }}
        >
          {headline}
        </div>
      </div>

      {/* Right cream panel */}
      <div
        style={{
          flex: 1,
          padding: "48px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: INK,
        }}
      >
        <div
          style={{
            fontSize: 38,
            color: INK,
            lineHeight: 1.3,
            fontStyle: "italic",
            fontWeight: 400,
            display: "flex",
          }}
        >
          &ldquo;{zinger}&rdquo;
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 22, color: TEAL, fontWeight: 700, letterSpacing: "0.05em" }}>
              &mdash; {attribution}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ fontSize: 40, fontFamily: "Allura", color: GOLD, lineHeight: 1 }}>
              Keri H. Carroll
            </div>
            <div style={{ fontSize: 14, color: TEAL, fontWeight: 700, letterSpacing: "0.3em", marginTop: 4 }}>
              CHANCERY COURT JUDGE · NOV 3, 2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LayoutProps {
  headline: string;
  zinger: string;
  attribution: string;
}
