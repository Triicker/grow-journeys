import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { planRepository } from "@/repositories";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import { Check, Loader2, MessageCircle, Sparkles } from "lucide-react";
import { formatPriceBRL } from "@/utils/format";
import { DemoBanner } from "@/components/DemoBanner";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/States";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Plan } from "@/types";
import { siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { buildWhatsAppContactUrl } from "@/utils/contact";

const PLANS_TIMEOUT_MS = 8_000;

async function listPlansWithTimeout() {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      planRepository.list(),
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error("Os planos demoraram para responder. Tente novamente.")),
          PLANS_TIMEOUT_MS,
        );
      }),
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

const plansQueryOptions = queryOptions({
  queryKey: ["plans"],
  queryFn: listPlansWithTimeout,
  staleTime: 60_000,
  retry: 1,
});

export const Route = createFileRoute("/planos/")({
  head: () => ({
    meta: [
      { title: "Planos — Nerya" },
      {
        name: "description",
        content: "Conheça os planos de inglês da Nerya e marque uma aula experimental gratuita.",
      },
    ],
    links: [{ rel: "canonical", href: `${siteConfig.url}/planos` }],
  }),
  loader: async ({ context }) => {
    try {
      return await context.queryClient.ensureQueryData(plansQueryOptions);
    } catch {
      return null;
    }
  },
  component: Plans,
});

function savingsLabel(plan: Plan): string | null {
  if (!plan.originalMonthlyPriceCents || plan.originalMonthlyPriceCents <= plan.monthlyPriceCents)
    return null;
  const saved = plan.originalMonthlyPriceCents - plan.monthlyPriceCents;
  const percent = Math.round((saved / plan.originalMonthlyPriceCents) * 100);
  return `${percent}% de desconto`;
}

function frequencyLabel(plan: Plan): string {
  return plan.lessonsPerWeek > 0 ? `${plan.lessonsPerWeek}x por semana` : "Aula avulsa";
}

function Plans() {
  const navigate = useNavigate();
  const initialPlans = Route.useLoaderData();
  const trackedViewRef = useRef(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const { data, isPending, error, refetch } = useQuery({
    ...plansQueryOptions,
    initialData: initialPlans ?? undefined,
  });

  useEffect(() => {
    if (isPending || trackedViewRef.current) return;
    trackedViewRef.current = true;
    trackEvent("plans_view", { plan_count: data?.data.length ?? 0 });
  }, [data?.data.length, isPending]);

  const choosePlan = useMutation({
    mutationFn: async (plan: Plan) => {
      setSelectedPlanId(plan.id);
      await new Promise((resolve) => setTimeout(resolve, 250));
      return plan;
    },
    onSuccess: (plan) => {
      toast.info(
        `Plano ${plan.name} selecionado. Marque sua aula experimental grátis para conversar sobre os próximos passos.`,
      );
      navigate({ to: "/agendar" });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Nao foi possivel escolher o plano.");
    },
  });

  const plans = data?.data ?? [];

  return (
    <PublicLayout>
      <section className="bg-plan-bg text-plan-ink">
        <div className="container-page py-14 md:py-18">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-plan-primary">
              Planos Nerya
            </p>
            <h1 className="mt-3 font-display text-4xl text-plan-ink md:text-6xl">
              Escolha sua frequência.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-plan-muted md:text-base">
              Conheça as opções de frequência e comece com uma aula experimental gratuita e ao vivo.
            </p>
          </div>

          <div className="mx-auto mt-7 max-w-3xl">
            <DemoBanner>
              A aula experimental é grátis. Os preços abaixo valem para as aulas contratadas depois
              dela; valores, horários e contratação são combinados no WhatsApp.
            </DemoBanner>
          </div>

          {isPending && (
            <div className="mx-auto mt-10 max-w-5xl rounded-lg border border-plan-border bg-plan-panel p-6">
              <LoadingBlock label="Carregando planos…" />
            </div>
          )}

          {error && (
            <div className="mx-auto mt-10 max-w-5xl">
              <ErrorState error={error} onRetry={() => refetch()} />
            </div>
          )}

          {!isPending && !error && plans.length === 0 && (
            <div className="mx-auto mt-10 max-w-3xl">
              <EmptyState
                title="Nenhum plano disponível"
                description="Novas opções de aulas serão publicadas em breve."
              />
            </div>
          )}

          {plans.length > 0 && (
            <div className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {plans.map((plan) => {
                const saving = savingsLabel(plan);
                const isChoosing = choosePlan.isPending && selectedPlanId === plan.id;
                const disabled = choosePlan.isPending;
                const priceAria = plan.originalMonthlyPriceCents
                  ? `${formatPriceBRL(plan.monthlyPriceCents)} por mês, de ${formatPriceBRL(plan.originalMonthlyPriceCents)}`
                  : `${formatPriceBRL(plan.monthlyPriceCents)}`;
                const planWhatsappUrl = buildWhatsAppContactUrl(
                  `Olá, tenho interesse em adquirir o plano ${plan.name} da Nerya (${frequencyLabel(plan)}, ${formatPriceBRL(plan.monthlyPriceCents)}). Gostaria de saber como continuar.`,
                );

                return (
                  <article
                    key={plan.id}
                    className={cn(
                      "relative flex min-w-0 flex-col rounded-lg border bg-plan-panel p-5 shadow-sm transition-colors",
                      plan.featured
                        ? "border-plan-primary bg-plan-panel-soft shadow-[0_18px_45px_-34px_var(--plan-primary-dark)]"
                        : "border-plan-border",
                      selectedPlanId === plan.id && "ring-2 ring-plan-primary",
                    )}
                  >
                    {plan.featured && (
                      <Badge className="absolute -top-3 left-4 gap-1 bg-plan-primary text-primary-foreground">
                        <Sparkles className="h-3 w-3" aria-hidden="true" />
                        Recomendado
                      </Badge>
                    )}

                    <div className="flex min-h-24 flex-col justify-between gap-4">
                      <div>
                        <h2 className="font-display text-2xl text-plan-ink">{plan.name}</h2>
                        <p className="mt-1 text-sm font-medium text-plan-primary">
                          {frequencyLabel(plan)}
                        </p>
                      </div>
                      <div className="rounded-md bg-plan-primary-dark px-3 py-2 text-sm font-semibold text-primary-foreground">
                        {plan.lessonsPerMonth === 1
                          ? "1 aula"
                          : `${plan.lessonsPerMonth} aulas por mês`}
                      </div>
                    </div>

                    <div className="mt-6 border-t border-plan-border pt-5">
                      <div className="min-h-6 text-sm">
                        {plan.originalMonthlyPriceCents ? (
                          <span className="text-plan-muted">
                            De{" "}
                            <span className="line-through decoration-plan-primary decoration-2">
                              {formatPriceBRL(plan.originalMonthlyPriceCents)}
                            </span>
                          </span>
                        ) : (
                          <span className="text-plan-muted">
                            {plan.lessonsPerMonth === 1 ? "Valor único" : "R$ 34,90 por aula"}
                          </span>
                        )}
                      </div>
                      <div className="mt-1" aria-label={priceAria}>
                        <span className="font-display text-5xl leading-none text-plan-primary-dark">
                          {formatPriceBRL(plan.monthlyPriceCents)}
                        </span>
                      </div>
                      <div className="mt-3 min-h-7">
                        {saving ? (
                          <span className="inline-flex rounded-md bg-plan-detail/15 px-2.5 py-1 text-xs font-semibold text-plan-primary-dark">
                            {saving}
                          </span>
                        ) : (
                          <span className="text-xs text-plan-muted">
                            {plan.lessonsPerMonth === 1
                              ? "Aula individual avulsa"
                              : "Total calculado pela quantidade de aulas"}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="mt-4 min-h-16 text-sm leading-relaxed text-plan-muted">
                      {plan.description}
                    </p>

                    <ul className="mt-5 flex-1 space-y-2 text-sm text-plan-ink">
                      {plan.features.map((feature) => (
                        <li key={feature.id} className="flex gap-2">
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-plan-primary"
                            aria-hidden="true"
                          />
                          <span>{feature.feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 grid gap-2">
                      <Button
                        type="button"
                        className={cn(
                          "min-h-11 w-full whitespace-normal bg-plan-primary px-3 text-center text-xs leading-tight text-primary-foreground hover:bg-plan-primary-dark",
                          plan.featured && "bg-plan-primary-dark hover:bg-plan-primary",
                        )}
                        disabled={disabled}
                        onClick={() => {
                          trackEvent("plan_select", { plan_id: plan.id, plan_name: plan.name });
                          trackEvent("cta_trial_click", { location: "plans", plan_id: plan.id });
                          choosePlan.mutate(plan);
                        }}
                        aria-label={`Marcar aula experimental após conhecer o plano ${plan.name}, ${priceAria}`}
                      >
                        {isChoosing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                            Selecionando
                          </>
                        ) : (
                          "Aula experimental"
                        )}
                      </Button>

                      {planWhatsappUrl ? (
                        <Button
                          asChild
                          type="button"
                          className="min-h-11 w-full whitespace-normal bg-[#25D366] px-3 text-center text-xs leading-tight text-white hover:bg-[#20bd5a]"
                        >
                          <a
                            href={planWhatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Adquirir o plano ${plan.name} pelo WhatsApp`}
                            onClick={() => {
                              trackEvent("plan_select", {
                                plan_id: plan.id,
                                plan_name: plan.name,
                                destination: "whatsapp",
                              });
                              trackEvent("whatsapp_click", {
                                location: "plans",
                                plan_id: plan.id,
                              });
                            }}
                          >
                            <MessageCircle className="h-4 w-4" aria-hidden="true" />
                            Adquirir plano
                          </a>
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          disabled
                          title="Configure o WhatsApp institucional para habilitar"
                          className="min-h-11 w-full whitespace-normal px-3 text-center text-xs leading-tight"
                        >
                          <MessageCircle className="h-4 w-4" aria-hidden="true" />
                          Adquirir plano
                        </Button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
