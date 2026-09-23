import { useEffect, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Mail, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { leadService } from "@/services/leadService";
import { trackEvent } from "@/lib/analytics";
import { ASSESSMENT_GOALS, PERCEIVED_LEVELS, goalLabel } from "./options";
import { ASSESSMENT_QUESTIONS } from "./questions";
import { calculateAssessmentResult } from "./scoring";
import { assessmentStorage } from "./storage";
import type { AssessmentGoal, AssessmentSession, PerceivedLevel } from "./types";

const TOTAL_STEPS = ASSESSMENT_QUESTIONS.length + 2;
const initialSession: AssessmentSession = { answers: {}, currentStep: 0 };

export function EnglishCheck() {
  const [started, setStarted] = useState(false);
  const [session, setSession] = useState<AssessmentSession>(initialSession);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = assessmentStorage.load();
    if (saved) {
      setSession(saved);
      setStarted(saved.currentStep > 0 || !!saved.goal || !!saved.result);
    }
    setReady(true);
    trackEvent("english_check_view");
  }, []);

  useEffect(() => {
    if (ready && started) assessmentStorage.save(session);
  }, [ready, session, started]);

  const chooseGoal = (goal: AssessmentGoal) => {
    setSession((current) => ({ ...current, goal }));
    trackEvent("assessment_answer", { step: "goal" });
  };
  const chooseLevel = (perceivedLevel: PerceivedLevel) => {
    setSession((current) => ({ ...current, perceivedLevel }));
    trackEvent("assessment_answer", { step: "self_assessment" });
  };
  const chooseAnswer = (questionId: string, answerId: string, category: string) => {
    setSession((current) => ({
      ...current,
      answers: { ...current.answers, [questionId]: answerId },
    }));
    trackEvent("assessment_answer", { step: category, question_id: questionId });
  };

  const canContinue =
    session.currentStep === 0
      ? !!session.goal
      : session.currentStep === 1
        ? !!session.perceivedLevel
        : !!session.answers[ASSESSMENT_QUESTIONS[session.currentStep - 2]?.id ?? ""];

  const next = () => {
    if (!canContinue) return;
    if (session.currentStep === TOTAL_STEPS - 1) {
      if (!session.goal || !session.perceivedLevel) return;
      const result = calculateAssessmentResult({
        answers: session.answers,
        goal: session.goal,
        perceivedLevel: session.perceivedLevel,
      });
      const completed = { ...session, result };
      setSession(completed);
      assessmentStorage.save(completed);
      trackEvent("assessment_complete", { level: result.level, goal: result.goal });
      trackEvent("assessment_result_view", { level: result.level });
      return;
    }
    setSession((current) => ({ ...current, currentStep: current.currentStep + 1 }));
  };

  const restart = () => {
    assessmentStorage.clear();
    setSession(initialSession);
    setStarted(false);
  };

  if (session.result) return <AssessmentResultView session={session} onRestart={restart} />;
  if (!ready || !started) {
    return (
      <section className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 text-center md:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          English Check
        </p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">Descubra seu nível de inglês</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Responda 12 etapas rápidas sobre seu objetivo e inglês. Leva de 3 a 6 minutos, sem
          cadastro e sem pedir e-mail antes do resultado.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-xs text-muted-foreground">
          Este é um diagnóstico orientativo baseado no CEFR (A1 a C1), não uma certificação oficial.
        </p>
        <Button
          className="mt-7 bg-brand text-primary-foreground hover:bg-brand-dark"
          size="lg"
          onClick={() => {
            setStarted(true);
            trackEvent("assessment_start");
          }}
        >
          Começar agora <ArrowRight className="h-4 w-4" />
        </Button>
      </section>
    );
  }

  const question =
    session.currentStep >= 2 ? ASSESSMENT_QUESTIONS[session.currentStep - 2] : undefined;
  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-5 md:p-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>
            Etapa {session.currentStep + 1} de {TOTAL_STEPS}
          </span>
          <span>3–6 minutos</span>
        </div>
        <Progress
          value={((session.currentStep + 1) / TOTAL_STEPS) * 100}
          aria-label="Progresso do English Check"
        />
      </div>

      {session.currentStep === 0 && (
        <ChoiceStep
          legend="Qual é seu principal objetivo com o inglês?"
          options={ASSESSMENT_GOALS}
          value={session.goal}
          onChange={(value) => chooseGoal(value as AssessmentGoal)}
        />
      )}
      {session.currentStep === 1 && (
        <ChoiceStep
          legend="Como você percebe seu inglês hoje?"
          options={PERCEIVED_LEVELS}
          value={session.perceivedLevel}
          onChange={(value) => chooseLevel(value as PerceivedLevel)}
        />
      )}
      {question && (
        <ChoiceStep
          legend={question.prompt}
          helper={`${question.category === "vocabulary" ? "Vocabulário" : question.category === "grammar" ? "Gramática" : question.category === "reading" ? "Leitura" : "Contexto"}`}
          options={question.options.map((option) => ({ value: option.id, label: option.label }))}
          value={session.answers[question.id]}
          onChange={(value) => chooseAnswer(question.id, value, question.category)}
        />
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          onClick={() =>
            session.currentStep === 0
              ? setStarted(false)
              : setSession((current) => ({ ...current, currentStep: current.currentStep - 1 }))
          }
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <Button
          disabled={!canContinue}
          onClick={next}
          className="bg-brand text-primary-foreground hover:bg-brand-dark"
        >
          {session.currentStep === TOTAL_STEPS - 1 ? "Ver resultado" : "Continuar"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}

function ChoiceStep({
  legend,
  helper,
  options,
  value,
  onChange,
}: {
  legend: string;
  helper?: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      {helper && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-light">
          {helper}
        </p>
      )}
      <legend className="font-display text-2xl leading-snug md:text-3xl">{legend}</legend>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm transition ${value === option.value ? "border-brand bg-brand/10" : "border-border hover:border-brand/50 hover:bg-surface"}`}
          >
            <input
              type="radio"
              name="assessment-choice"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="h-4 w-4 accent-[color:var(--brand)]"
            />
            <span>{option.label}</span>
            {value === option.value && (
              <Check className="ml-auto h-4 w-4 text-brand-light" aria-hidden="true" />
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function AssessmentResultView({
  session,
  onRestart,
}: {
  session: AssessmentSession;
  onRestart: () => void;
}) {
  const result = session.result!;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const sendResult = async (event: FormEvent) => {
    event.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    trackEvent("assessment_email_result_click", { level: result.level });
    try {
      await leadService.submit({
        intent: "assessment_result",
        fullName: name,
        email,
        preferredChannel: "email",
        message: `Resultado orientativo do English Check: ${result.level}.`,
        goal: result.goal,
        perceivedLevel: session.perceivedLevel,
        estimatedLevel: result.level,
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-2xl border border-brand/30 bg-card p-6 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          Seu resultado orientativo
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <span className="font-display text-7xl text-brand-light">{result.level}</span>
          <div className="pb-2">
            <h1 className="font-display text-3xl">{result.label}</h1>
            <p className="text-sm text-muted-foreground">Pontuação estimada: {result.score}/100</p>
          </div>
        </div>
        <p className="mt-5 max-w-2xl text-muted-foreground">{result.description}</p>
        <p className="mt-3 text-sm">
          <strong>Seu objetivo:</strong> {goalLabel(result.goal)}
        </p>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="font-display text-xl">Pontos fortes</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {result.strengths.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="font-display text-xl">O que desenvolver</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {result.improvements.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-5 rounded-xl border border-border p-5">
          <h2 className="font-display text-xl">Próximo passo recomendado</h2>
          <p className="mt-2 text-sm text-muted-foreground">{result.recommendation}</p>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          O English Check é um diagnóstico breve e não substitui uma avaliação completa nem
          constitui certificado oficial.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="bg-brand text-primary-foreground hover:bg-brand-dark"
          >
            <Link
              to="/agendar"
              onClick={() => trackEvent("assessment_trial_click", { level: result.level })}
            >
              Marcar aula experimental
            </Link>
          </Button>
          <Button variant="outline" onClick={onRestart}>
            <RotateCcw className="h-4 w-4" /> Refazer
          </Button>
        </div>
      </div>

      <form
        onSubmit={sendResult}
        className="rounded-2xl border border-border bg-card p-6"
        aria-busy={status === "loading"}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">Opcional</p>
        <h2 className="mt-2 font-display text-2xl">Receber o resultado por e-mail</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Seu resultado já está disponível acima. Informe seus dados apenas se quiser recebê-lo por
          e-mail.
        </p>
        {status === "success" ? (
          <p
            role="status"
            className="mt-4 rounded-md border border-brand/30 bg-brand/10 p-3 text-sm"
          >
            Solicitação enviada. Confira seu e-mail.
          </p>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
            <div>
              <Label htmlFor="result-name">Nome</Label>
              <Input
                id="result-name"
                value={name}
                required
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="result-email">E-mail</Label>
              <Input
                id="result-email"
                type="email"
                value={email}
                required
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <Button className="self-end" disabled={status === "loading"}>
              {status === "loading" ? (
                "Enviando..."
              ) : (
                <>
                  <Mail className="h-4 w-4" /> Enviar
                </>
              )}
            </Button>
          </div>
        )}
        {status === "error" && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            Não foi possível enviar agora. Tente novamente.
          </p>
        )}
      </form>
    </section>
  );
}
