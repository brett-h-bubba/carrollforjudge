import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Dynamic OG image for donor thank-you sharing.
 *
 * Layout:
 *   I DONATED.
 *   I'LL BE VOTING NOVEMBER 3, 2026.
 *
 *   "{rotating slogan}"
 *
 *                                        — {FirstName}
 *                                         [logo]
 *   [DONATED stamp, top-right corner]
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

// Tiny deterministic string hash (djb2)
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

  // Brand palette — these are the only approved colors.
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
          background: cream,
          position: "relative",
          padding: "64px 80px",
        }}
      >
        {/* DONATED stamp — top right, angled, rubber-stamp style */}
        <div
          style={{
            position: "absolute",
            top: "48px",
            right: "56px",
            transform: "rotate(8deg)",
            border: `4px solid ${gold}`,
            padding: "8px 24px",
            color: gold,
            fontFamily: "Cormorant",
            fontWeight: 700,
            fontSize: "38px",
            letterSpacing: "10px",
            textTransform: "uppercase",
            display: "flex",
            background: "rgba(247, 241, 232, 0.9)",
          }}
        >
          Donated
        </div>

        {/* Headline block */}
        <div
          style={{
            color: teal,
            fontFamily: "Cormorant",
            fontWeight: 700,
            fontSize: "64px",
            lineHeight: 1.0,
            display: "flex",
            flexDirection: "column",
            marginTop: "16px",
          }}
        >
          <span>I donated.</span>
          <span style={{ fontSize: "40px", color: teal, marginTop: "8px" }}>
            I&apos;ll be voting November 3, 2026.
          </span>
        </div>

        {/* Rotating slogan */}
        <div
          style={{
            marginTop: "64px",
            color: teal,
            fontFamily: "Cormorant",
            fontWeight: 700,
            fontSize: "48px",
            fontStyle: "italic",
            lineHeight: 1.2,
            display: "flex",
            maxWidth: "820px",
          }}
        >
          &ldquo;{slogan}&rdquo;
        </div>

        {/* Signature + logo bottom-right */}
        <div
          style={{
            position: "absolute",
            right: "80px",
            bottom: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              color: gold,
              fontFamily: "Allura",
              fontSize: "88px",
              lineHeight: 1,
              marginBottom: "4px",
              display: "flex",
            }}
          >
            — {displayName}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoDataUri}
            alt="Carroll for Judge"
            width={260}
            style={{ marginTop: "6px" }}
          />
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
