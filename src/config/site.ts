import { env } from "@/config/env";

export type TeacherProfile = {
  name: string;
  role: string;
  photoUrl?: string;
  photoAlt?: string;
  introduction: string;
  experience: string;
  specializations: string[];
  methodology: string;
  studentProfiles: string[];
  differentiators: string[];
  isPlaceholder: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  avatarUrl?: string;
  quote: string;
  goal: string;
  followUpPeriod: string;
  videoUrl?: string;
};

const teacherProfile: TeacherProfile = {
  name: "Professor da Nerya",
  role: "Acompanhamento individual de inglês",
  introduction:
    "A mesma pessoa conduz as aulas, acompanha os objetivos combinados e ajusta a prática ao longo do processo.",
  experience:
    "Perfil profissional em atualização. Inclua aqui tempo de experiência, contextos de atuação e resultados que possam ser comprovados.",
  specializations: [
    "Conversação e desenvolvimento de confiança ao falar",
    "Pronúncia, vocabulário e situações de uso real",
    "Preparação orientada a viagens, entrevistas e rotina profissional",
  ],
  methodology:
    "Aulas individuais ao vivo, com prática guiada, feedback durante o encontro e prioridades definidas a partir do objetivo do aluno.",
  studentProfiles: [
    "Adultos iniciantes",
    "Quem quer destravar a conversação",
    "Viagens e entrevistas",
  ],
  differentiators: [
    "Mesmo professor durante o acompanhamento",
    "Plano ajustado ao objetivo e ao ritmo do aluno",
    "Agenda combinada diretamente com a Nerya",
  ],
  isPlaceholder: true,
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
  teacher: teacherProfile,
  testimonials: [] as Testimonial[],
} as const;
