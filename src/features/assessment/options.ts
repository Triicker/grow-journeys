import type { AssessmentGoal, CefrLevel, PerceivedLevel } from "./types";

export const ASSESSMENT_GOALS: Array<{ value: AssessmentGoal; label: string }> = [
  { value: "conversation", label: "Conversação" },
  { value: "work", label: "Trabalho" },
  { value: "interview", label: "Entrevista" },
  { value: "travel", label: "Viagem" },
  { value: "general", label: "Inglês geral" },
  { value: "exams", label: "Provas/certificações" },
  { value: "technology", label: "Tecnologia" },
  { value: "other", label: "Outro" },
];

export const PERCEIVED_LEVELS: Array<{ value: PerceivedLevel; label: string }> = [
  { value: "never", label: "Nunca estudei" },
  { value: "basic", label: "Básico" },
  { value: "intermediate", label: "Intermediário" },
  { value: "advanced", label: "Avançado" },
  { value: "unsure", label: "Não sei" },
];

export const CEFR_LABELS: Record<CefrLevel, string> = {
  A1: "Iniciante",
  A2: "Básico",
  B1: "Intermediário",
  B2: "Intermediário avançado",
  C1: "Avançado",
};

export function goalLabel(value?: AssessmentGoal): string {
  return ASSESSMENT_GOALS.find((option) => option.value === value)?.label ?? "Não informado";
}

export function perceivedLevelLabel(value?: PerceivedLevel): string {
  return PERCEIVED_LEVELS.find((option) => option.value === value)?.label ?? "Não informado";
}
