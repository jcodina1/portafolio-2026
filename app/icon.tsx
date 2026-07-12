import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Favicon de marca: monograma cobre sobre marino.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14293b",
          color: "#b58863",
          fontSize: 22,
          fontWeight: 700,
          borderRadius: 6,
        }}
      >
        C
      </div>
    ),
    { ...size },
  );
}
