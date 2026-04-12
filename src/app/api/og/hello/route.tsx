import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#215b64",
          color: "#f7f1e8",
          fontSize: 64,
        }}
      >
        Hello from Satori
      </div>
    ),
    { width: 600, height: 300 }
  );
}
