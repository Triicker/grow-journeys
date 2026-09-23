import { env } from "@/config/env";
import type { LeadRequest } from "@/types";

type LeadMessageInput = Pick<
  LeadRequest,
  | "intent"
  | "fullName"
  | "email"
  | "whatsapp"
  | "preferredSchedule"
  | "message"
  | "goal"
  | "perceivedLevel"
  | "estimatedLevel"
>;

const GOALS: Record<NonNullable<LeadRequest["goal"]>, string> = {
  conversation: "Conversação",
  work: "Trabalho",
  interview: "Entrevista",
  travel: "Viagem",
  general: "Inglês geral",
  exams: "Provas/certificações",
  technology: "Tecnologia",
  other: "Outro",
};

export function normalizeWhatsAppNumber(value: string): string {
  return value.replace(/\D/g, "");
}

export function hasConfiguredWhatsApp(): boolean {
  return normalizeWhatsAppNumber(env.publicWhatsAppNumber).length >= 10;
}

export function formatLeadSubject(input: Pick<LeadRequest, "intent" | "fullName">): string {
  const prefix =
    input.intent === "scheduling"
      ? "Solicitacao de aula experimental gratuita"
      : input.intent === "assessment_result"
        ? "Resultado do English Check"
        : "Contato pelo site";
  return `${prefix} - ${input.fullName}`;
}

export function formatLeadMessage(input: LeadMessageInput): string {
  const intent =
    input.intent === "scheduling" ? "marcar uma aula experimental gratuita" : "falar com a Nerya";
  return [
    `Ola, quero ${intent}.`,
    "",
    `Nome: ${input.fullName}`,
    `E-mail: ${input.email}`,
    input.whatsapp ? `WhatsApp: ${input.whatsapp}` : null,
    input.goal ? `Objetivo: ${GOALS[input.goal]}` : null,
    input.perceivedLevel ? `Nível percebido: ${input.perceivedLevel}` : null,
    input.estimatedLevel ? `English Check: ${input.estimatedLevel}` : null,
    input.preferredSchedule ? `Disponibilidade: ${input.preferredSchedule}` : null,
    "",
    input.message ? "Mensagem:" : null,
    input.message || null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildWhatsAppUrl(input: LeadMessageInput): string | null {
  return buildWhatsAppContactUrl(formatLeadMessage(input));
}

export function buildWhatsAppContactUrl(message: string): string | null {
  const target = normalizeWhatsAppNumber(env.publicWhatsAppNumber);
  if (!target) return null;
  const text = encodeURIComponent(message.trim());
  return `https://wa.me/${target}?text=${text}`;
}
