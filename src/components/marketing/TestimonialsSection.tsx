import { CirclePlay, Quote, UserRound } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useSectionTracking } from "@/hooks/use-section-tracking";
import { SpotlightCard } from "@/components/visual/SpotlightCard";

export function TestimonialsSection() {
  const testimonials = siteConfig.testimonials;
  const sectionRef = useSectionTracking<HTMLElement>("testimonial_view", {
    section: "testimonials",
    count: testimonials.length,
  });

  return (
    <section
      ref={sectionRef}
      id="depoimentos"
      className="container-page py-20 md:py-24"
      data-reveal
    >
      <div className="grid gap-10 md:grid-cols-[0.78fr_1.22fr] md:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
            Experiências dos alunos
          </p>
          <h2 className="mt-3 text-foreground">Evolução contada por quem faz as aulas.</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Esta área foi preparada para relatos autorizados, com objetivo e período de
            acompanhamento. Nenhum número ou depoimento fictício é exibido.
          </p>
        </div>

        {testimonials.length === 0 ? (
          <SpotlightCard className="flex min-h-56 items-center rounded-2xl border border-dashed border-border bg-surface/40 p-8">
            <div>
              <Quote className="h-7 w-7 text-brand-light" aria-hidden="true" />
              <p className="mt-5 text-lg font-medium text-foreground">
                Depoimentos reais serão publicados aqui.
              </p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                A estrutura já aceita nome, foto, relato, objetivo, tempo de acompanhamento e,
                futuramente, vídeo. A publicação depende da coleta e autorização dos alunos.
              </p>
            </div>
          </SpotlightCard>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {testimonials.map((testimonial) => (
              <SpotlightCard
                as="figure"
                key={testimonial.id}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <blockquote className="text-sm leading-relaxed text-foreground">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    {testimonial.avatarUrl ? (
                      <img
                        src={testimonial.avatarUrl}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand-light">
                        <UserRound className="h-4 w-4" aria-hidden="true" />
                      </span>
                    )}
                    <span>
                      <span className="block font-semibold text-foreground">
                        {testimonial.name}
                      </span>
                      <span className="mt-1 block">Objetivo: {testimonial.goal}</span>
                      <span className="block">Acompanhamento: {testimonial.followUpPeriod}</span>
                    </span>
                  </div>
                  {testimonial.videoUrl && (
                    <a
                      href={testimonial.videoUrl}
                      className="mt-3 inline-flex items-center gap-2 text-brand-light hover:underline"
                    >
                      <CirclePlay className="h-4 w-4" aria-hidden="true" /> Assistir depoimento
                    </a>
                  )}
                </figcaption>
              </SpotlightCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
