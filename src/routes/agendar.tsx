import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

export const Route = createFileRoute("/agendar")({
  head: () => ({
    meta: [
      { title: "Aula experimental — Nerya" },
      {
        name: "description",
        content:
          "Solicite sua aula experimental gratuita de inglês. Seus dados são enviados por e-mail e o atendimento continua no WhatsApp.",
      },
    ],
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
            description="Conte um pouco sobre você. Ao enviar, seus dados chegam automaticamente por e-mail e o WhatsApp é aberto para combinar sua aula gratuita."
          />
        </div>
      </section>
    </PublicLayout>
  );
}
