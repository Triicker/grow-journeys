import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/agendar")({
  head: () => ({
    meta: [
      { title: "Aula experimental — Nerya" },
      {
        name: "description",
        content:
          "Solicite sua aula experimental gratuita de inglês e escolha entre consultar horários ou continuar pelo WhatsApp.",
      },
    ],
    links: [{ rel: "canonical", href: `${siteConfig.url}/agendar` }],
  }),
  component: SchedulePublic,
});

function SchedulePublic() {
  return (
    <PublicLayout>
      <section className="container-page py-12 md:py-16">
        <div className="mx-auto max-w-2xl">
          <LeadCaptureForm
            intent="scheduling"
            title="Marque sua aula experimental grátis"
            description="Conte um pouco sobre você. Ao enviar, seus dados chegam à Nerya e você escolhe como prefere continuar."
          />
        </div>
      </section>
    </PublicLayout>
  );
}
