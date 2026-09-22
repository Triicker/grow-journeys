import { useState, type FormEvent } from "react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { env } from "@/config/env";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DemoBanner } from "@/components/DemoBanner";
import { leadService } from "@/services/leadService";
import { hasConfiguredWhatsApp } from "@/utils/contact";
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

export function LeadCaptureForm({
  intent,
  title,
  description,
}: LeadCaptureFormProps) {
  const [form, setForm] = useState<LeadFormState>(emptyForm);
  const [renderedAt, setRenderedAt] = useState(() => new Date().toISOString());
  const [loading, setLoading] = useState(false);
  const whatsappReady = hasConfiguredWhatsApp();
  const isMock = env.leadsDataSource === "mock";

  const update = <K extends keyof LeadFormState>(key: K, value: LeadFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const response = await leadService.submit({
        intent,
        fullName: form.fullName,
        email: form.email,
        whatsapp: form.whatsapp,
        preferredChannel: "whatsapp",
        message: form.message,
        website: form.website,
        renderedAt,
      });
      toast.success(response.data.message);
      setForm(emptyForm);
      setRenderedAt(new Date().toISOString());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Nao foi possivel enviar agora.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
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

      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
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
        disabled={loading || !whatsappReady}
        className="w-full bg-brand text-primary-foreground hover:bg-brand-dark"
      >
        {loading ? (
          "Enviando..."
        ) : (
          <>
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Enviar e continuar no WhatsApp
          </>
        )}
      </Button>
      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        {whatsappReady
          ? intent === "scheduling"
            ? "Sua aula experimental é grátis. Ao clicar, seus dados são enviados por e-mail e o WhatsApp é aberto para combinar os detalhes."
            : "Ao clicar, sua mensagem é enviada por e-mail e o WhatsApp é aberto para continuar o atendimento."
          : "O envio será habilitado assim que o número de atendimento do WhatsApp estiver configurado."}
      </p>
    </form>
  );
}
