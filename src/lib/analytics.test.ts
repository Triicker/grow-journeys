import { describe, expect, it, vi } from "vitest";
import { registerAnalyticsProvider, trackEvent } from "./analytics";

describe("analytics adapter", () => {
  it("does not fail when no provider is configured", () => {
    expect(() => trackEvent("page_view", { path: "/" })).not.toThrow();
  });

  it("forwards normalized events and allows providers to be removed", () => {
    const track = vi.fn();
    const unregister = registerAnalyticsProvider({ track });

    trackEvent("faq_open", { question_id: "faq-1" });
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "faq_open",
        properties: { question_id: "faq-1" },
      }),
    );

    unregister();
    trackEvent("faq_open", { question_id: "faq-2" });
    expect(track).toHaveBeenCalledTimes(1);
  });
});
