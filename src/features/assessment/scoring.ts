import { ASSESSMENT_QUESTIONS } from "./questions";
import { CEFR_LABELS, goalLabel } from "./options";
import type {
  AssessmentCategory,
  AssessmentGoal,
  AssessmentResult,
  CefrLevel,
  PerceivedLevel,
} from "./types";

const CATEGORY_LABELS: Record<AssessmentCategory, string> = {
  vocabulary: "vocabulário",
  grammar: "gramática",
  reading: "leitura",
  context: "uso do inglês em contexto",
};

const DESCRIPTIONS: Record<CefrLevel, string> = {
  A1: "Você reconhece expressões bem básicas e já pode construir uma base prática.",
  A2: "Você compreende frases frequentes e consegue lidar com situações simples do cotidiano.",
  B1: "Você entende os pontos principais de temas familiares e se comunica em situações comuns.",
  B2: "Você compreende ideias mais complexas e se comunica com boa autonomia.",
  C1: "Você usa o inglês com flexibilidade e compreende textos e contextos exigentes.",
};

const SELF_SCORE: Record<PerceivedLevel, number> = {
  never: 0,
  basic: 25,
  intermediate: 55,
  advanced: 90,
  unsure: 40,
};

export function levelFromScore(score: number): CefrLevel {
  if (score < 25) return "A1";
  if (score < 45) return "A2";
  if (score < 65) return "B1";
  if (score < 83) return "B2";
  return "C1";
}

export function calculateAssessmentResult(input: {
  answers: Record<string, string>;
  goal: AssessmentGoal;
  perceivedLevel: PerceivedLevel;
  completedAt?: string;
}): AssessmentResult {
  const totalWeight = ASSESSMENT_QUESTIONS.reduce((sum, question) => sum + question.weight, 0);
  const correctWeight = ASSESSMENT_QUESTIONS.reduce(
    (sum, question) =>
      sum + (input.answers[question.id] === question.correctOptionId ? question.weight : 0),
    0,
  );
  const objectiveScore = (correctWeight / totalWeight) * 100;
  const score = Math.round(objectiveScore * 0.85 + SELF_SCORE[input.perceivedLevel] * 0.15);
  const level = levelFromScore(score);

  const categoryRates = (Object.keys(CATEGORY_LABELS) as AssessmentCategory[]).map((category) => {
    const questions = ASSESSMENT_QUESTIONS.filter((question) => question.category === category);
    const total = questions.reduce((sum, question) => sum + question.weight, 0);
    const correct = questions.reduce(
      (sum, question) =>
        sum + (input.answers[question.id] === question.correctOptionId ? question.weight : 0),
      0,
    );
    return { category, rate: total ? correct / total : 0 };
  });
  const ranked = [...categoryRates].sort((a, b) => b.rate - a.rate);

  return {
    level,
    score,
    label: CEFR_LABELS[level],
    description: DESCRIPTIONS[level],
    strengths: ranked.slice(0, 2).map(({ category }) => CATEGORY_LABELS[category]),
    improvements: ranked
      .slice(-2)
      .reverse()
      .map(({ category }) => CATEGORY_LABELS[category]),
    recommendation: `Para seu objetivo de ${goalLabel(input.goal).toLowerCase()}, priorize prática guiada de ${CATEGORY_LABELS[ranked.at(-1)?.category ?? "context"]} com feedback individual.`,
    goal: input.goal,
    completedAt: input.completedAt ?? new Date().toISOString(),
  };
}
