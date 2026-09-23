import type { BookingConfirmation } from "./types";

function compactDate(value: string): string {
  return new Date(value)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

export function googleCalendarUrl(booking: BookingConfirmation): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Aula experimental de inglês — Nerya",
    dates: `${compactDate(booking.startsAt)}/${compactDate(booking.endsAt)}`,
    details: "Aula experimental online com a Nerya.",
    ctz: booking.timezone,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcs(booking: BookingConfirmation): void {
  const contents = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nerya//Aula experimental//PT-BR",
    "BEGIN:VEVENT",
    `UID:${booking.id}@nerya.online`,
    `DTSTAMP:${compactDate(new Date().toISOString())}`,
    `DTSTART:${compactDate(booking.startsAt)}`,
    `DTEND:${compactDate(booking.endsAt)}`,
    "SUMMARY:Aula experimental de inglês — Nerya",
    "DESCRIPTION:Aula experimental online com a Nerya.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([contents], { type: "text/calendar;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "aula-experimental-nerya.ics";
  anchor.click();
  URL.revokeObjectURL(url);
}
