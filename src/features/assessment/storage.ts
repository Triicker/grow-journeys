import type { AssessmentSession } from "./types";

const ASSESSMENT_KEY = "nerya:english-check";

export const assessmentStorage = {
  load(): AssessmentSession | null {
    if (typeof window === "undefined") return null;
    try {
      const value = window.sessionStorage.getItem(ASSESSMENT_KEY);
      return value ? (JSON.parse(value) as AssessmentSession) : null;
    } catch {
      return null;
    }
  },
  save(session: AssessmentSession): void {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(ASSESSMENT_KEY, JSON.stringify(session));
  },
  clear(): void {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(ASSESSMENT_KEY);
  },
};
