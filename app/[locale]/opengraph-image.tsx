import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Juan Camilo Codina Ariza";

// OG base (US5/T075 lo refina por tipo de página).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "#0e151c",
          color: "#faf9f6",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#e3b98c",
          }}
        >
          Senior Fullstack · Bogotá
        </div>
        <div style={{ fontSize: 88, fontWeight: 700, marginTop: 16 }}>
          Juan Camilo Codina
        </div>
        <div style={{ fontSize: 32, marginTop: 16, color: "#b9b6ac" }}>
          Productos web, integraciones de datos e IA para negocios.
        </div>
      </div>
    ),
    { ...size },
  );
}
