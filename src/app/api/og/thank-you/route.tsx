import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Dynamic OG image for donor thank-you sharing.
 *
 * Usage: <meta og:image> points at /api/og/thank-you?fn=Brett&amt=50
 * Returns a 1200x630 PNG rendered via Satori with the brand template.
 *
 * Keep text short and brand-safe — MS Canon 5 restricts misleading
 * judicial campaign material, so we show only the donor's first name
 * and a static supporter message. No AI generation.
 */

async function loadFont(filename: string): Promise<ArrayBuffer> {
  const buf = await fs.readFile(path.join(process.cwd(), "public", "fonts", filename));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const firstName = (searchParams.get("fn") || "").trim().slice(0, 40);

  const [cormorantBold, allura] = await Promise.all([
    loadFont("cormorant-700.ttf"),
    loadFont("allura-400.ttf"),
  ]);

  // Brand colors — must stay in the approved palette.
  const teal = "#215b64";
  const gold = "#b08a49";
  const cream = "#f7f1e8";

  const greeting = firstName ? firstName : "Friend";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: cream,
          position: "relative",
          padding: "60px 80px",
        }}
      >
        {/* Teal left bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "24px",
            background: teal,
          }}
        />

        {/* Gold small-caps label */}
        <div
          style={{
            color: gold,
            fontSize: "22px",
            letterSpacing: "8px",
            textTransform: "uppercase",
            fontFamily: "Cormorant",
            fontWeight: 700,
            marginTop: "20px",
          }}
        >
          I&apos;m Supporting
        </div>

        {/* Script first name */}
        <div
          style={{
            color: gold,
            fontSize: "130px",
            fontFamily: "Allura",
            lineHeight: 1,
            marginTop: "10px",
          }}
        >
          {greeting}
        </div>

        {/* Main title */}
        <div
          style={{
            color: teal,
            fontSize: "82px",
            fontFamily: "Cormorant",
            fontWeight: 700,
            lineHeight: 1.05,
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>is supporting</span>
          <span style={{ color: teal }}>Keri H. Carroll</span>
        </div>

        {/* Footer strip */}
        <div
          style={{
            position: "absolute",
            left: 24,
            right: 0,
            bottom: 0,
            background: teal,
            color: cream,
            padding: "16px 80px",
            fontFamily: "Cormorant",
            fontWeight: 700,
            fontSize: "24px",
            letterSpacing: "6px",
            textTransform: "uppercase",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Chancery Court Judge</span>
          <span style={{ color: gold }}>Nov 3, 2026</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Cormorant", data: cormorantBold, weight: 700, style: "normal" },
        { name: "Allura", data: allura, weight: 400, style: "normal" },
      ],
    },
  );
}
