import { describe, expect, it } from "vitest";
import { leadFormSchema } from "./lead-validation";

describe("lead qualification validation", () => {
  it("accepts an optional empty message", () => {
    expect(
      leadFormSchema.safeParse({
        fullName: "Ana Souza",
        email: "ana@example.com",
        whatsapp: "71999999999",
        goal: "conversation",
        perceivedLevel: "basic",
        message: "",
      }).success,
    ).toBe(true);
  });

  it("requires goal and perceived level", () => {
    const parsed = leadFormSchema.safeParse({
      fullName: "Ana Souza",
      email: "ana@example.com",
      whatsapp: "71999999999",
      goal: "",
      perceivedLevel: "",
    });
    expect(parsed.success).toBe(false);
  });
});
