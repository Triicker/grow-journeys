import { describe, expect, it } from "vitest";
import { googleCalendarUrl } from "./calendar";

describe("booking calendar", () => {
  it("creates a Google Calendar URL with the Bahia timezone", () => {
    const url = googleCalendarUrl({
      id: "booking-1",
      startsAt: "2026-09-24T13:00:00.000Z",
      endsAt: "2026-09-24T14:00:00.000Z",
      timezone: "America/Bahia",
      attendeeName: "Ana",
      attendeeEmail: "ana@example.com",
    });
    expect(url).toContain("calendar.google.com");
    expect(url).toContain("ctz=America%2FBahia");
    expect(url).toContain("20260924T130000Z%2F20260924T140000Z");
  });
});
