import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/config/site";

export const alt = `${site.name}: Google reviews for local businesses`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STAR_PATH =
  "M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L12 3.5Z";

export default async function Image() {
  const libreFranklinExtraBold = await readFile(
    join(process.cwd(), "src/app/fonts/LibreFranklin-ExtraBold.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          background: "#FFFFFF",
        }}
      >
        <svg width={64} height={64} viewBox="0 0 24 24" style={{ marginBottom: 32 }}>
          <path d={STAR_PATH} fill="#F5B000" stroke="#A87700" strokeWidth={1} />
        </svg>
        <div
          style={{
            display: "flex",
            fontFamily: "Libre Franklin",
            fontWeight: 800,
            fontSize: 72,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "#13251D",
            maxWidth: 920,
          }}
        >
          Ask every customer. Answer every review.
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Libre Franklin",
            fontWeight: 800,
            fontSize: 32,
            color: "#3D5249",
            marginTop: 32,
          }}
        >
          $29 a month. No contract.
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Libre Franklin",
            fontWeight: 800,
            fontSize: 24,
            color: "#5C6F66",
            marginTop: 48,
          }}
        >
          buzrareviews.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Libre Franklin",
          data: libreFranklinExtraBold,
          style: "normal",
          weight: 800,
        },
      ],
    }
  );
}
