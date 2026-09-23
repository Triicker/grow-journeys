import { CheckCircle2, GraduationCap, UserRound } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useSectionTracking } from "@/hooks/use-section-tracking";

export function TeacherSection() {
  const teacher = siteConfig.teacher;
  const sectionRef = useSectionTracking<HTMLElement>("teacher_section_view", {
    section: "teacher",
  });

  return (
    <section ref={sectionRef} id="professor" className="border-y border-border bg-surface/35">
      <div className="container-page grid gap-12 py-20 md:grid-cols-[0.78fr_1.22fr] md:items-center md:py-24">
        <div className="relative mx-auto w-full max-w-sm">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-surface-2">
            {teacher.photoUrl ? (
              <img
                src={teacher.photoUrl}
                alt={teacher.photoAlt ?? `Foto de ${teacher.name}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full border border-brand-light/30 bg-brand/15 text-brand-light">
                  <UserRound className="h-9 w-9" aria-hidden="true" />
                </div>
                <p className="mt-6 text-sm font-medium text-foreground">Foto do professor</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Espaço preparado para uma foto profissional real.
                </p>
              </div>
            )}
          </div>
          <div className="absolute -bottom-4 -right-2 rounded-lg border border-border bg-background px-4 py-3 text-xs text-muted-foreground shadow-xl md:-right-5">
            <span className="block font-medium text-foreground">Um professor</span>
            do início à evolução
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
            Quem acompanha você
          </p>
          <h2 className="mt-3 max-w-2xl text-foreground">
            Continuidade para ensinar melhor. Proximidade para ajustar o caminho.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {teacher.introduction}
          </p>

          <div className="mt-8 border-l-2 border-brand pl-5">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl text-foreground">{teacher.name}</h3>
              {teacher.isPlaceholder && (
                <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Perfil editável
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-brand-light">{teacher.role}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {teacher.experience}
            </p>
          </div>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <GraduationCap className="h-4 w-4 text-brand-light" aria-hidden="true" />
                Como são as aulas
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {teacher.methodology}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {teacher.specializations.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-light"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">Para quem faz sentido</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {teacher.studentProfiles.map((item) => (
                  <li key={item}>— {item}</li>
                ))}
              </ul>
              <p className="mt-6 text-sm font-semibold text-foreground">Diferenciais</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {teacher.differentiators.map((item) => (
                  <li key={item}>— {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
