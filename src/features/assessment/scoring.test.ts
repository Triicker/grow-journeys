import { describe, expect, it } from "vitest";
import { ASSESSMENT_QUESTIONS } from "./questions";
import { calculateAssessmentResult, levelFromScore } from "./scoring";

describe("assessment scoring", () => {
  it.each([
    [0, "A1"],
    [24, "A1"],
    [25, "A2"],
    [44, "A2"],
    [45, "B1"],
    [64, "B1"],
    [65, "B2"],
    [82, "B2"],
    [83, "C1"],
    [100, "C1"],
  ] as const)("maps score %s to %s", (score, level) => {
    expect(levelFromScore(score)).toBe(level);
  });

  it("is deterministic and returns useful recommendations", () => {
    const answers = Object.fromEntries(
      ASSESSMENT_QUESTIONS.map((question) => [question.id, question.correctOptionId]),
    );
    const input = {
      answers,
      goal: "work" as const,
      perceivedLevel: "advanced" as const,
      completedAt: "2026-09-23T12:00:00.000Z",
    };
    expect(calculateAssessmentResult(input)).toEqual(calculateAssessmentResult(input));
    expect(calculateAssessmentResult(input)).toMatchObject({
      level: "C1",
      goal: "work",
      strengths: expect.any(Array),
      improvements: expect.any(Array),
      recommendation: expect.stringContaining("trabalho"),
    });
  });
});
