export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export type AssessmentGoal =
  | "conversation"
  | "work"
  | "interview"
  | "travel"
  | "general"
  | "exams"
  | "technology"
  | "other";

export type PerceivedLevel = "never" | "basic" | "intermediate" | "advanced" | "unsure";
export type AssessmentCategory = "vocabulary" | "grammar" | "reading" | "context";

export type AssessmentQuestion = {
  id: string;
  category: AssessmentCategory;
  prompt: string;
  options: Array<{ id: string; label: string }>;
  correctOptionId: string;
  weight: number;
};

export type AssessmentResult = {
  level: CefrLevel;
  score: number;
  label: string;
  description: string;
  strengths: string[];
  improvements: string[];
  recommendation: string;
  goal: AssessmentGoal;
  completedAt: string;
};

export type AssessmentSession = {
  goal?: AssessmentGoal;
  perceivedLevel?: PerceivedLevel;
  answers: Record<string, string>;
  currentStep: number;
  result?: AssessmentResult;
};
