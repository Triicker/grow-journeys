import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { env } from "@/config/env";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DemoBanner } from "@/components/DemoBanner";
import { ASSESSMENT_GOALS, PERCEIVED_LEVELS } from "@/features/assessment/options";
import { assessmentStorage } from "@/features/assessment/storage";
import { leadFormSchema } from "@/features/assessment/lead-validation";
import { bookingStorage } from "@/features/booking/storage";
import { leadService } from "@/services/leadService";
import { hasConfiguredWhatsApp } from "@/utils/contact";
import { trackEvent } from "@/lib/analytics";
import { useSectionTracking } from "@/hooks/use-section-tracking";
import type { LeadGoal, LeadIntent, LeadPerceivedLevel } from "@/types";

type LeadCaptureFormProps = { intent: LeadIntent; title?: string; description?: string };
type LeadFormState = {
  fullName: string;
  email: string;
  whatsapp: string;
  goal: LeadGoal | "";
  perceivedLevel: LeadPerceivedLevel | "";
  message: string;
  website: string;
};

const emptyForm: LeadFormState = {
  fullName: "",
  email: "",
  whatsapp: "",
  goal: "",
  perceivedLevel: "",
  message: "",
  website: "",
};

export function LeadCaptureForm({ intent, title, description }: LeadCaptureFormProps) {
  const [form, setForm] = useState<LeadFormState>(emptyForm);
  const [estimatedLevel, setEstimatedLevel] = useState<string>();
  const [renderedAt, setRenderedAt] = useState(() => new Date().toISOString());
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );
  const [continuation, setContinuation] = useState<{ whatsappUrl?: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const startedRef = useRef(false);
  const formRef = useSectionTracking<HTMLFormElement>(
    intent === "scheduling" ? "trial_form_view" : null,
    { location: `${intent}_form_view` },
  );
  const whatsappReady = hasConfiguredWhatsApp();

  useEffect(() => {
    const session = assessmentStorage.load();
    if (!session) return;
    setEstimatedLevel(session.result?.level);
    setForm((current) => ({
      ...current,
      goal: session.goal ?? current.goal,
      perceivedLevel: session.perceivedLevel ?? current.perceivedLevel,
    }));
  }, []);

  const update = <K extends keyof LeadFormState>(key: K, value: LeadFormState[K]) => {
    if (key !== "website" && !startedRef.current) {
      startedRef.current = true;
      if (intent === "scheduling") trackEvent("trial_form_start", { form: intent });
    }
    setErrors((current) => ({ ...current, [key]: "" }));
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    const parsed = leadFormSchema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) nextErrors[String(issue.path[0])] = issue.message;
      setErrors(nextErrors);
      setFeedback({ type: "error", message: "Revise os campos indicados." });
      return;
    }

    setLoading(true);
    setFeedback(null);
    if (intent === "scheduling")
      trackEvent("trial_form_submit", { has_assessment: !!estimatedLevel });
    try {
      const response = await leadService.submit(
        {
          intent,
          fullName: form.fullName,
          email: form.email,
          whatsapp: form.whatsapp,
          goal: form.goal as LeadGoal,
          perceivedLevel: form.perceivedLevel as LeadPerceivedLevel,
          estimatedLevel: estimatedLevel as "A1" | "A2" | "B1" | "B2" | "C1" | undefined,
          preferredChannel: whatsappReady ? "whatsapp" : "email",
          message: form.message,
          website: form.website,
          renderedAt,
        },
        { deferWhatsApp: intent === "scheduling" },
      );
      toast.success(response.data.message);
      setFeedback({ type: "success", message: response.data.message });
      if (intent === "scheduling") {
        trackEvent("trial_form_success", { has_assessment: !!estimatedLevel });
        bookingStorage.setLead({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          whatsapp: form.whatsapp.trim(),
          goal: form.goal as LeadGoal,
          estimatedLevel: estimatedLevel as "A1" | "A2" | "B1" | "B2" | "C1" | undefined,
          whatsappUrl: response.data.whatsappUrl,
        });
        setContinuation({ whatsappUrl: response.data.whatsappUrl });
      } else {
        setForm(emptyForm);
        setRenderedAt(new Date().toISOString());
        startedRef.current = false;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível enviar agora.";
      toast.error(message);
      setFeedback({ type: "error", message });
      if (intent === "scheduling") trackEvent("trial_form_error", { stage: "lead_submit" });
    } finally {
      setLoading(false);
    }
  };

  if (continuation) {
    return (
      <section
        className="surface-premium space-y-5 rounded-xl border border-brand/30 bg-card p-6"
        aria-live="polite"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          Dados recebidos
        </p>
        <h2 className="font-display text-3xl">Como você prefere continuar?</h2>
        <p className="text-sm text-muted-foreground">
          Você pode consultar a agenda online ou combinar diretamente pelo WhatsApp. Nenhuma conta é
          necessária.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            asChild
            className="cta-primary bg-brand text-primary-foreground hover:bg-brand-dark"
          >
            <Link to="/agendar/horario">
              <CalendarDays className="h-4 w-4" aria-hidden="true" /> Escolher horário
            </Link>
          </Button>
          {continuation.whatsappUrl ? (
            <Button asChild variant="outline">
              <a href={continuation.whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> Continuar no WhatsApp
              </a>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              WhatsApp indisponível
            </Button>
          )}
        </div>
      </section>
    );
  }

  const fieldError = (name: keyof LeadFormState) =>
    errors[name] ? <p className="mt-1 text-xs text-destructive">{errors[name]}</p> : null;
  return (
    <form
      ref={formRef}
      onSubmit={submit}
      aria-busy={loading}
      className="surface-premium space-y-4 rounded-lg border border-border/60 bg-card p-5 md:p-6"
      noValidate
    >
      <div>
        <p className="text-xs uppercase tracking-widest text-brand-light">
          {intent === "scheduling" ? "Aula experimental" : "Contato"}
        </p>
        <h2 className="mt-2 font-display text-3xl">
          {title ??
            (intent === "scheduling" ? "Marcar aula experimental grátis" : "Enviar mensagem")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {description ?? "Conte seu objetivo e fale com a Nerya."}
        </p>
      </div>
      {env.leadsDataSource === "mock" && (
        <DemoBanner>
          Modo de demonstração: a solicitação fica registrada apenas neste navegador.
        </DemoBanner>
      )}
      {estimatedLevel && (
        <p className="rounded-md border border-brand/30 bg-brand/10 p-3 text-sm">
          English Check identificado: <strong>{estimatedLevel}</strong>. Esse resultado será anexado
          ao contato.
        </p>
      )}
      <div className="hidden" aria-hidden="true">
        <Label htmlFor={`${intent}-website`}>Website</Label>
        <Input
          id={`${intent}-website`}
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => update("website", event.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${intent}-name`}>Nome</Label>
          <Input
            id={`${intent}-name`}
            autoComplete="name"
            value={form.fullName}
            aria-invalid={!!errors.fullName}
            onChange={(event) => update("fullName", event.target.value)}
          />
          {fieldError("fullName")}
        </div>
        <div>
          <Label htmlFor={`${intent}-email`}>E-mail</Label>
          <Input
            id={`${intent}-email`}
            type="email"
            autoComplete="email"
            value={form.email}
            aria-invalid={!!errors.email}
            onChange={(event) => update("email", event.target.value)}
          />
          {fieldError("email")}
        </div>
      </div>
      <div>
        <Label htmlFor={`${intent}-whatsapp`}>WhatsApp</Label>
        <Input
          id={`${intent}-whatsapp`}
          inputMode="tel"
          autoComplete="tel"
          placeholder="(DDD) 99999-9999"
          value={form.whatsapp}
          aria-invalid={!!errors.whatsapp}
          onChange={(event) => update("whatsapp", event.target.value)}
        />
        {fieldError("whatsapp")}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${intent}-goal`}>Seu objetivo</Label>
          <select
            id={`${intent}-goal`}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={form.goal}
            aria-invalid={!!errors.goal}
            onChange={(event) => update("goal", event.target.value as LeadFormState["goal"])}
          >
            <option value="">Selecione</option>
            {ASSESSMENT_GOALS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldError("goal")}
        </div>
        <div>
          <Label htmlFor={`${intent}-level`}>Como percebe seu nível?</Label>
          <select
            id={`${intent}-level`}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={form.perceivedLevel}
            aria-invalid={!!errors.perceivedLevel}
            onChange={(event) =>
              update("perceivedLevel", event.target.value as LeadFormState["perceivedLevel"])
            }
          >
            <option value="">Selecione</option>
            {PERCEIVED_LEVELS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldError("perceivedLevel")}
        </div>
      </div>
      <div>
        <Label htmlFor={`${intent}-message`}>
          Mensagem <span className="text-muted-foreground">(opcional)</span>
        </Label>
        <Textarea
          id={`${intent}-message`}
          rows={4}
          placeholder="Conte algo que possa nos ajudar a preparar seu atendimento."
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
        />
        {fieldError("message")}
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="cta-primary w-full bg-brand text-primary-foreground hover:bg-brand-dark"
      >
        {loading ? (
          "Enviando..."
        ) : (
          <>
            <Mail className="h-4 w-4" aria-hidden="true" /> Enviar dados
          </>
        )}
      </Button>
      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        Depois do envio, você escolhe entre consultar horários ou continuar pelo WhatsApp. Usaremos
        os dados apenas para responder sobre as aulas. Consulte a nossa{" "}
        <Link to="/privacidade" className="text-brand-light underline-offset-4 hover:underline">
          Política de Privacidade
        </Link>
        .
      </p>
      {feedback && (
        <p
          role={feedback.type === "error" ? "alert" : "status"}
          className={
            feedback.type === "error"
              ? "rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
              : "rounded-md border border-brand-light/30 bg-brand/10 p-3 text-sm"
          }
        >
          {feedback.message}
        </p>
      )}
    </form>
  );
}
