import type { BookingConfirmation, BookingSlot, PublicLeadHandoff } from "./types";

export interface BookingProvider {
  readonly name: string;
  isAvailable(): boolean;
  getAvailableDates(): Promise<string[]>;
  getAvailableSlots(date: string): Promise<BookingSlot[]>;
  createBooking(slot: BookingSlot, lead: PublicLeadHandoff): Promise<BookingConfirmation>;
}

// O site ainda não possui integração real de agenda. Este adaptador retorna indisponibilidade
// de forma explícita para impedir que uma reserva fictícia seja apresentada como confirmada.
export const unavailableBookingProvider: BookingProvider = {
  name: "unavailable",
  isAvailable: () => false,
  async getAvailableDates() {
    return [];
  },
  async getAvailableSlots() {
    return [];
  },
  async createBooking() {
    throw new Error("Agenda online indisponível. Continue pelo WhatsApp.");
  },
};

let publicBookingProvider: BookingProvider = unavailableBookingProvider;

export function getPublicBookingProvider(): BookingProvider {
  return publicBookingProvider;
}

export function registerPublicBookingProvider(provider: BookingProvider): () => void {
  const previous = publicBookingProvider;
  publicBookingProvider = provider;
  return () => {
    publicBookingProvider = previous;
  };
}
