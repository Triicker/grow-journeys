import type { LeadEstimatedLevel, LeadGoal } from "@/types";

export type PublicLeadHandoff = {
  fullName: string;
  email: string;
  whatsapp?: string;
  goal?: LeadGoal;
  estimatedLevel?: LeadEstimatedLevel;
  whatsappUrl?: string;
};

export type BookingSlot = { id: string; startsAt: string; endsAt: string };
export type BookingConfirmation = {
  id: string;
  startsAt: string;
  endsAt: string;
  timezone: "America/Bahia";
  attendeeName: string;
  attendeeEmail: string;
};
