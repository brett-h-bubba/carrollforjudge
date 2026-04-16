import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

// Brand colors
const TEAL_DARK = "#17434a";
const GOLD = "#b08a49";

/**
 * 192×192 PNG favicon — what Google actually uses in search results.
 * A multiple of 48, raster, which is what Google's favicon docs recommend.
 *
 * The sibling icon.svg serves modern browsers at crisp sizes. This PNG is
 * the reliable fallback for Google Search, Outlook email clients,
 * Bing/DuckDuckGo, older browsers, and any other consumer that doesn't
 * fully trust SVG favicons.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: TEAL_DARK,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          borderRadius: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Top finial */}
          <div
            style={{
              display: "flex",
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: GOLD,
            }}
          />
          <div style={{ display: "flex", width: 1, height: 4 }} />

          {/* Horizontal beam */}
          <div
            style={{
              display: "flex",
              width: "100%",
              height: 10,
              background: GOLD,
              borderRadius: 4,
            }}
          />

          {/* Row of chains + pans + central post */}
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: 2,
            }}
          >
            {/* Left pan group */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 48,
              }}
            >
              <div style={{ display: "flex", width: 2, height: 18, background: GOLD }} />
              <div
                style={{
                  display: "flex",
                  width: 48,
                  height: 26,
                  background: GOLD,
                  borderRadius: "0 0 48px 48px",
                }}
              />
            </div>

            {/* Central post */}
            <div
              style={{
                display: "flex",
                width: 8,
                height: 86,
                background: GOLD,
                borderRadius: 2,
              }}
            />

            {/* Right pan group */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 48,
              }}
            >
              <div style={{ display: "flex", width: 2, height: 18, background: GOLD }} />
              <div
                style={{
                  display: "flex",
                  width: 48,
                  height: 26,
                  background: GOLD,
                  borderRadius: "0 0 48px 48px",
                }}
              />
            </div>
          </div>

          {/* Base */}
          <div
            style={{
              display: "flex",
              width: 86,
              height: 8,
              background: GOLD,
              borderRadius: 2,
              marginTop: 4,
            }}
          />
          <div
            style={{
              display: "flex",
              width: 116,
              height: 8,
              background: GOLD,
              borderRadius: 2,
              marginTop: 3,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
