import { useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { env } from "@/config/env";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DemoBanner } from "@/components/DemoBanner";
import { leadService } from "@/services/leadService";
import { hasConfiguredWhatsApp } from "@/utils/contact";
import { trackEvent } from "@/lib/analytics";
import { useSectionTracking } from "@/hooks/use-section-tracking";
import type { LeadIntent } from "@/types";

type LeadCaptureFormProps = {
  intent: LeadIntent;
  title?: string;
  description?: string;
};

type LeadFormState = {
  fullName: string;
  email: string;
  whatsapp: string;
  message: string;
  website: string;
};

const emptyForm: LeadFormState = {
  fullName: "",
  email: "",
  whatsapp: "",
  message: "",
  website: "",
};

function defaultTitle(intent: LeadIntent): string {
  return intent === "scheduling" ? "Marcar aula experimental grátis" : "Enviar mensagem";
}

function defaultDescription(intent: LeadIntent): string {
  return intent === "scheduling"
    ? "Conte seu objetivo com o inglês e solicite sua aula experimental grátis."
    : "Envie sua dúvida sobre planos, aulas ou seus objetivos de inglês.";
}

export function LeadCaptureForm({ intent, title, description }: LeadCaptureFormProps) {
  const [form, setForm] = useState<LeadFormState>(emptyForm);
  const [renderedAt, setRenderedAt] = useState(() => new Date().toISOString());
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );
  const startedRef = useRef(false);
  const formRef = useSectionTracking<HTMLFormElement>(
    intent === "scheduling" ? "trial_form_view" : null,
    { location: `${intent}_form_view` },
  );
  const whatsappReady = hasConfiguredWhatsApp();
  const isMock = env.leadsDataSource === "mock";

  const update = <K extends keyof LeadFormState>(key: K, value: LeadFormState[K]) => {
    if (key !== "website" && !startedRef.current) {
      startedRef.current = true;
      if (intent === "scheduling") trackEvent("trial_form_start", { form: intent });
    }
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setFeedback(null);
    if (intent === "scheduling")
      trackEvent("trial_form_submit", { channel: whatsappReady ? "whatsapp" : "email" });
    if (intent === "contact") trackEvent("contact_click", { location: "contact_form_submit" });
    if (whatsappReady) trackEvent("whatsapp_click", { location: `${intent}_form` });
    try {
      const response = await leadService.submit({
        intent,
        fullName: form.fullName,
        email: form.email,
        whatsapp: form.whatsapp,
        preferredChannel: whatsappReady ? "whatsapp" : "email",
        message: form.message,
        website: form.website,
        renderedAt,
      });
      toast.success(response.data.message);
      setFeedback({ type: "success", message: response.data.message });
      if (intent === "scheduling") {
        trackEvent("trial_form_success", { channel: whatsappReady ? "whatsapp" : "email" });
      }
      setForm(emptyForm);
      setRenderedAt(new Date().toISOString());
      startedRef.current = false;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível enviar agora.";
      toast.error(message);
      setFeedback({ type: "error", message });
      if (intent === "scheduling") trackEvent("trial_form_error", { message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      aria-busy={loading}
      className="space-y-4 rounded-lg border border-border/60 bg-card p-5 md:p-6"
    >
      <div>
        <p className="text-xs uppercase tracking-widest text-primary">
          {intent === "scheduling" ? "Aula experimental" : "Contato"}
        </p>
        <h2 className="mt-2 font-display text-3xl">{title ?? defaultTitle(intent)}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {description ?? defaultDescription(intent)}
        </p>
      </div>

      {isMock && (
        <DemoBanner>
          Modo de demonstração: a solicitação fica registrada apenas neste navegador.
        </DemoBanner>
      )}

      <div className="hidden" aria-hidden="true">
        <Label htmlFor={`${intent}-website`}>Website</Label>
        <Input
          id={`${intent}-website`}
          name="website"
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
            required
            value={form.fullName}
            onChange={(event) => update("fullName", event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor={`${intent}-email`}>E-mail</Label>
          <Input
            id={`${intent}-email`}
            type="email"
            required
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor={`${intent}-whatsapp`}>WhatsApp</Label>
        <Input
          id={`${intent}-whatsapp`}
          inputMode="tel"
          autoComplete="tel"
          placeholder="(DDD) 99999-9999"
          required
          value={form.whatsapp}
          onChange={(event) => update("whatsapp", event.target.value)}
        />
      </div>

      <div>
        <Label htmlFor={`${intent}-message`}>Mensagem</Label>
        <Textarea
          id={`${intent}-message`}
          rows={5}
          required
          placeholder={
            intent === "scheduling"
              ? "Conte seu nível de inglês e o que você quer alcançar."
              : "Escreva sua dúvida ou objetivo."
          }
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-brand text-primary-foreground hover:bg-brand-dark"
      >
        {loading ? (
          "Enviando..."
        ) : (
          <>
            {whatsappReady ? (
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Mail className="h-4 w-4" aria-hidden="true" />
            )}
            {whatsappReady ? "Enviar e continuar no WhatsApp" : "Enviar por e-mail"}
          </>
        )}
      </Button>
      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        {whatsappReady
          ? intent === "scheduling"
            ? "Sua aula experimental é grátis. Ao clicar, seus dados são enviados por e-mail e o WhatsApp é aberto para combinar os detalhes."
            : "Ao clicar, sua mensagem é enviada por e-mail e o WhatsApp é aberto para continuar o atendimento."
          : "Seus dados serão enviados por e-mail. O WhatsApp será oferecido quando o número institucional estiver configurado."}
      </p>
      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        Usaremos seus dados apenas para responder sobre as aulas. Consulte a nossa{" "}
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
              : "rounded-md border border-brand-light/30 bg-brand/10 p-3 text-sm text-foreground"
          }
        >
          {feedback.message}
        </p>
      )}
    </form>
  );
}
