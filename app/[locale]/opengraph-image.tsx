import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Juan Camilo Codina Ariza";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });

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
        <div style={{ fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: "#e3b98c" }}>
          {t("eyebrow")}
        </div>
        <div style={{ fontSize: 88, fontWeight: 700, marginTop: 16 }}>Juan Camilo Codina</div>
        <div style={{ fontSize: 30, marginTop: 16, color: "#b9b6ac" }}>{t("ogTagline")}</div>
      </div>
    ),
    { ...size },
  );
}
