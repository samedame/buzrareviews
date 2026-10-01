import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const STAR_PATH =
  "M16 6.5l3.2 6.6 7.3 1-5.3 5.2 1.3 7.3-6.5-3.4-6.5 3.4 1.3-7.3-5.3-5.2 7.3-1L16 6.5Z";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#13251D",
        }}
      >
        <svg width={112} height={112} viewBox="0 0 32 32">
          <path d={STAR_PATH} fill="#F5B000" stroke="#A87700" strokeWidth={1} strokeLinejoin="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
