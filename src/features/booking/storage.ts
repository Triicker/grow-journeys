import type { BookingConfirmation, PublicLeadHandoff } from "./types";

const LEAD_KEY = "nerya:public-booking-lead";
const CONFIRMATION_KEY = "nerya:public-booking-confirmation";

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.sessionStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window !== "undefined") window.sessionStorage.setItem(key, JSON.stringify(value));
}

export const bookingStorage = {
  getLead: () => read<PublicLeadHandoff>(LEAD_KEY),
  setLead: (lead: PublicLeadHandoff) => write(LEAD_KEY, lead),
  getConfirmation: () => read<BookingConfirmation>(CONFIRMATION_KEY),
  setConfirmation: (confirmation: BookingConfirmation) => write(CONFIRMATION_KEY, confirmation),
};
