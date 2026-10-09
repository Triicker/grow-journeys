import { env } from "@/config/env";

const siteUrl = env.publicSiteUrl.replace(/\/$/, "");

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
  url: siteUrl,
  tagline: "Inglês que conecta. Fluência que transforma.",
  assets: {
    logo: `${siteUrl}/logoo.png`,
    socialImage: `${siteUrl}/og-image.png`,
  },
  contact: {
    email: env.publicContactEmail,
    location: "Bahia — Brasil",
    instagramUrl: "https://www.instagram.com/somosnerya/",
    instagramHandle: "@somosnerya",
  },
  testimonials: [] as Testimonial[],
} as const;
