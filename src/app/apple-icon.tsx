import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Brand colors
const TEAL_DARK = "#17434a";
const GOLD = "#b08a49";

export default function AppleIcon() {
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
          padding: 18,
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

          {/* Tiny gap */}
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
                width: 46,
              }}
            >
              {/* Chain */}
              <div
                style={{
                  display: "flex",
                  width: 2,
                  height: 18,
                  background: GOLD,
                }}
              />
              {/* Pan (half bowl) */}
              <div
                style={{
                  display: "flex",
                  width: 46,
                  height: 24,
                  background: GOLD,
                  borderRadius: "0 0 46px 46px",
                }}
              />
            </div>

            {/* Central post */}
            <div
              style={{
                display: "flex",
                width: 8,
                height: 82,
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
                width: 46,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 2,
                  height: 18,
                  background: GOLD,
                }}
              />
              <div
                style={{
                  display: "flex",
                  width: 46,
                  height: 24,
                  background: GOLD,
                  borderRadius: "0 0 46px 46px",
                }}
              />
            </div>
          </div>

          {/* Base platform */}
          <div
            style={{
              display: "flex",
              width: 82,
              height: 8,
              background: GOLD,
              borderRadius: 2,
              marginTop: 4,
            }}
          />
          <div
            style={{
              display: "flex",
              width: 110,
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
