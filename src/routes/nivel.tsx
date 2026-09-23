import { createFileRoute } from "@tanstack/react-router";
import { EnglishCheck } from "@/features/assessment/EnglishCheck";
import { PublicLayout } from "@/layouts/PublicLayout";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/nivel")({
  head: () => ({
    meta: [
      { title: "Teste de nível de inglês grátis — Nerya" },
      {
        name: "description",
        content:
          "Descubra seu nível de inglês de A1 a C1 em um diagnóstico gratuito de 3 a 6 minutos, sem cadastro.",
      },
      { property: "og:title", content: "English Check — descubra seu nível de inglês" },
      {
        property: "og:description",
        content: "Diagnóstico gratuito e orientativo de inglês, sem cadastro.",
      },
      { property: "og:url", content: `${siteConfig.url}/nivel` },
    ],
    links: [{ rel: "canonical", href: `${siteConfig.url}/nivel` }],
  }),
  component: EnglishCheckPage,
});

function EnglishCheckPage() {
  return (
    <PublicLayout>
      <div className="container-page py-10 md:py-16">
        <EnglishCheck />
      </div>
    </PublicLayout>
  );
}
