import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Dynamic donor thank-you OG card.
 *
 * Visual brief: share-worthy civic keepsake. Cream canvas with an inset
 * teal frame (old-design callback), rotating slogan as the hero, Keri's
 * logo on the left, Allura-script signature on the right, gold "DONATED"
 * stamp angled top-right, and a teal footer strip with office + date.
 *
 * Rotation is hash-deterministic on donor first name so the same person
 * always sees the same slogan.
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
    loadPngDataUri("logo-og.png"), // Downsized 480px wide, ~35KB — small enough for Satori
  ]);

  const teal = "#215b64";
  const gold = "#b08a49";
  const cream = "#f7f1e8";

  return new ImageResponse(
    (
      // Outer cream canvas with subtle gold edge
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: cream,
          display: "flex",
          padding: "28px",
          position: "relative",
        }}
      >
        {/* Inset teal frame */}
        <div
          style={{
            flex: 1,
            border: `2px solid ${teal}`,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            padding: "48px 56px 0",
          }}
        >
          {/* DONATED stamp — tucked into top-right corner */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "14px",
              transform: "rotate(8deg)",
              border: `3px solid ${gold}`,
              padding: "6px 20px",
              color: gold,
              fontFamily: "Cormorant",
              fontWeight: 700,
              fontSize: "26px",
              letterSpacing: "10px",
              textTransform: "uppercase",
              display: "flex",
              background: cream,
            }}
          >
            Donated
          </div>

          {/* Hero slogan — the thing that makes this shareable */}
          <div
            style={{
              color: teal,
              fontFamily: "Cormorant",
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: "78px",
              lineHeight: 1.05,
              letterSpacing: "-1px",
              display: "flex",
              maxWidth: "1000px",
              marginTop: "8px",
            }}
          >
            &ldquo;{slogan}&rdquo;
          </div>

          {/* Affirm line */}
          <div
            style={{
              marginTop: "24px",
              color: gold,
              fontFamily: "Cormorant",
              fontWeight: 700,
              fontSize: "36px",
              display: "flex",
            }}
          >
            Keri&apos;s got my vote.
          </div>

          {/* Logo (left) + signature (right) — asymmetric balance */}
          <div
            style={{
              display: "flex",
              flex: 1,
              alignItems: "flex-end",
              justifyContent: "space-between",
              paddingBottom: "28px",
              marginTop: "auto",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoDataUri} alt="Carroll for Judge" width={240} height={115} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                paddingBottom: "6px",
              }}
            >
              <div
                style={{
                  color: gold,
                  fontFamily: "Allura",
                  fontSize: "96px",
                  lineHeight: 1,
                  display: "flex",
                }}
              >
                — {displayName}
              </div>
              <div
                style={{
                  color: teal,
                  fontFamily: "Cormorant",
                  fontWeight: 700,
                  fontSize: "16px",
                  letterSpacing: "6px",
                  textTransform: "uppercase",
                  marginTop: "4px",
                  display: "flex",
                }}
              >
                Proud Supporter
              </div>
            </div>
          </div>

          {/* Teal footer strip */}
          <div
            style={{
              marginLeft: "-56px",
              marginRight: "-56px",
              background: teal,
              color: cream,
              padding: "14px 56px",
              fontFamily: "Cormorant",
              fontWeight: 700,
              fontSize: "20px",
              letterSpacing: "8px",
              textTransform: "uppercase",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Chancery Court Judge</span>
            <span style={{ color: gold }}>November 3, 2026</span>
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
