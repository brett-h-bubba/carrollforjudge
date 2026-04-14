import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Dynamic OG image for donor thank-you sharing.
 *
 * Layout (hero = rotating slogan):
 *   {BIG rotating slogan}
 *   CHANCERY COURT JUDGE · NOV 3, 2026
 *   Keri's got my vote.
 *
 *   [logo]                              — {FirstName}
 *
 * Rotation is hash-based on first name so a given donor always sees the
 * same slogan (no flicker between reloads or shares).
 */

const SLOGANS = [
  "I helped elect the most qualified judge.",
  "I helped elect the right judge.",
  "I chose family first, too.",
  "Experience made my choice easy.",
  "Rankin County families deserve this.",
  "She earned my vote.",
  "I chose experience. I chose Keri.",
  "This is what leadership looks like.",
];

function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return h >>> 0;
}

async function loadFont(filename: string): Promise<ArrayBuffer> {
  const buf = await fs.readFile(path.join(process.cwd(), "public", "fonts", filename));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

async function loadPngDataUri(filename: string): Promise<string> {
  const buf = await fs.readFile(path.join(process.cwd(), "public", "images", filename));
  return `data:image/png;base64,${buf.toString("base64")}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const firstName = (searchParams.get("fn") || "").trim().slice(0, 40);
  const displayName = firstName || "Friend";

  const sloganIdx = hashString(displayName.toLowerCase()) % SLOGANS.length;
  const slogan = SLOGANS[sloganIdx];

  const [cormorantBold, allura, logoDataUri] = await Promise.all([
    loadFont("cormorant-700.ttf"),
    loadFont("allura-400.ttf"),
    loadPngDataUri("logo.png"),
  ]);

  const teal = "#215b64";
  const gold = "#b08a49";
  const cream = "#f7f1e8";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: cream,
          position: "relative",
          padding: "64px 80px 48px",
        }}
      >
        {/* DONATED stamp — top right, angled */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "56px",
            transform: "rotate(8deg)",
            border: `4px solid ${gold}`,
            padding: "6px 20px",
            color: gold,
            fontFamily: "Cormorant",
            fontWeight: 700,
            fontSize: "30px",
            letterSpacing: "8px",
            textTransform: "uppercase",
            display: "flex",
            background: "rgba(247, 241, 232, 0.9)",
          }}
        >
          Donated
        </div>

        {/* Top content block */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "1040px" }}>
          {/* Hero: rotating slogan */}
          <div
            style={{
              color: teal,
              fontFamily: "Cormorant",
              fontWeight: 700,
              fontSize: "86px",
              lineHeight: 1.02,
              display: "flex",
              letterSpacing: "-1px",
            }}
          >
            &ldquo;{slogan}&rdquo;
          </div>

          {/* Sub-line: office + date, different color */}
          <div
            style={{
              marginTop: "28px",
              color: gold,
              fontFamily: "Cormorant",
              fontWeight: 700,
              fontSize: "30px",
              letterSpacing: "8px",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Chancery Court Judge · Nov 3, 2026
          </div>

          {/* Affirm line */}
          <div
            style={{
              marginTop: "20px",
              color: teal,
              fontFamily: "Cormorant",
              fontWeight: 700,
              fontSize: "44px",
              fontStyle: "italic",
              display: "flex",
            }}
          >
            Keri&apos;s got my vote.
          </div>
        </div>

        {/* Bottom row: logo left, signature right */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoDataUri}
            alt="Carroll for Judge"
            width={220}
          />
          <div
            style={{
              color: gold,
              fontFamily: "Allura",
              fontSize: "96px",
              lineHeight: 1,
              display: "flex",
              paddingBottom: "12px",
            }}
          >
            — {displayName}
          </div>
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
