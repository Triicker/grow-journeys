import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ClipboardList, MailCheck, MessageCircle, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/como-funciona")({
  head: () => ({
    meta: [
      { title: "Como funciona — Nerya" },
      {
        name: "description",
        content:
          "Entenda como solicitar uma aula experimental gratuita e conhecer as aulas particulares da Nerya.",
      },
    ],
    links: [{ rel: "canonical", href: `${siteConfig.url}/como-funciona` }],
  }),
  component: HowItWorks,
});

const STEPS = [
  {
    icon: ClipboardList,
    title: "Preencha o formulário",
    text: "Conte seu nível de inglês, seu objetivo e informe seus dados de contato.",
  },
  {
    icon: MailCheck,
    title: "Receba a confirmação",
    text: "A solicitação chega para a Nerya e você recebe uma confirmação automática por e-mail.",
  },
  {
    icon: MessageCircle,
    title: "Continue o atendimento",
    text: "Depois do envio por e-mail, uma conversa pronta é aberta no WhatsApp para combinar os detalhes.",
  },
  {
    icon: Sparkles,
    title: "Faça a aula grátis",
    text: "Conheça a dinâmica ao vivo sem custo, com foco em conversação, pronúncia e seus objetivos.",
  },
];

function HowItWorks() {
  return (
    <PublicLayout>
      <section className="container-page max-w-5xl py-20">
        <p className="text-xs uppercase tracking-widest text-coral">Como funciona</p>
        <h1 className="mt-2 font-display text-5xl leading-[0.95] md:text-7xl">
          INGLÊS AO VIVO,
          <br />
          COM <span className="text-lilac">ROTINA CLARA</span>.
        </h1>
        <p className="mt-8 max-w-3xl text-lg text-muted-foreground">
          A experiência começa com uma aula experimental gratuita. Você envia seus dados por e-mail
          e o WhatsApp é aberto para combinar os detalhes diretamente com a Nerya.
        </p>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {STEPS.map((step) => (
            <div key={step.title} className="rounded-lg border border-border/60 bg-card p-5">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <step.icon className="h-5 w-5" />
              </div>
              <div className="mt-5 font-display text-2xl text-foreground">
                {step.title.toUpperCase()}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-border/60 bg-[color:var(--background-soft)] p-6">
          <h2 className="font-display text-3xl">O acompanhamento é individual.</h2>
          <ul className="mt-5 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
            {[
              "Foco em conversação e segurança para falar.",
              "Correção de pronúncia durante a prática.",
              "Temas alinhados a viagens, trabalho e rotina.",
              "Próximos passos combinados diretamente no atendimento.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link
              to="/agendar"
              onClick={() => trackEvent("cta_trial_click", { location: "how_it_works" })}
            >
              Marcar aula experimental
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/planos">Ver planos</Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
