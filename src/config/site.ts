import { env } from "@/config/env";

export type Testimonial = {
  id: string;
  name: string;
  avatarUrl?: string;
  quote: string;
  goal: string;
  followUpPeriod: string;
  videoUrl?: string;
};

export const siteConfig = {
  name: "Nerya",
  url: env.publicSiteUrl.replace(/\/$/, ""),
  tagline: "Inglês que conecta. Fluência que transforma.",
  contact: {
    email: env.publicContactEmail,
    location: "Bahia — Brasil",
    instagramUrl: "https://www.instagram.com/somosnerya/",
    instagramHandle: "@somosnerya",
  },
  testimonials: [] as Testimonial[],
} as const;
