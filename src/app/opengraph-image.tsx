import { ImageResponse } from "next/og";

import { site } from "@/content/site";

export const alt = `${site.brand} · ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          backgroundColor: "#f7eacb",
          color: "#1b231d",
          fontFamily: "Arial, sans-serif",
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(27,35,29,.035) 0px, rgba(27,35,29,.035) 1px, transparent 1px, transparent 5px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 10, height: 42, backgroundColor: "#008c4c" }} />
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Superteam Brasil · Privacy Sprint
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1.04 }}>
            {site.brand.toUpperCase()}
          </div>
          <div style={{ display: "flex", fontSize: 48, fontWeight: 800 }}>
            COLOQUE PRIVACIDADE NO SEU PROJETO.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            backgroundColor: "#008c4c",
            color: "#fffdf6",
            padding: "16px 24px",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          1000 USDC · 10 PRÊMIOS · CLOAK + ZCASH
        </div>
      </div>
    ),
    size,
  );
}
