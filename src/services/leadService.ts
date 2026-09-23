import { env } from "@/config/env";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import type { ApiResponse, LeadRequest, LeadSubmissionResult } from "@/types";
import { buildWhatsAppUrl } from "@/utils/contact";
import { shortCode } from "@/utils/format";

type LeadSubmissionInput = Omit<LeadRequest, "id" | "createdAt"> & {
  website?: string;
  renderedAt?: string;
};

type LeadApiPayload = LeadRequest & {
  website?: string;
  renderedAt?: string;
};

type LeadSubmissionOptions = { deferWhatsApp?: boolean };

function loadLocalLeads(): LeadRequest[] {
  return storage.get<LeadRequest[]>(STORAGE_KEYS.leadRequests, []);
}

function saveLocalLead(lead: LeadRequest): void {
  storage.set(STORAGE_KEYS.leadRequests, [...loadLocalLeads(), lead]);
}

function apiUrl(path: string): string {
  return `${env.apiBaseUrl.replace(/\/$/, "")}${path}`;
}

async function submitLeadToApi(lead: LeadApiPayload): Promise<ApiResponse<LeadSubmissionResult>> {
  const response = await fetch(apiUrl("/leads"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      intent: lead.intent,
      fullName: lead.fullName,
      email: lead.email,
      whatsapp: lead.whatsapp,
      preferredChannel: lead.preferredChannel,
      preferredSchedule: lead.preferredSchedule,
      message: lead.message,
      goal: lead.goal,
      perceivedLevel: lead.perceivedLevel,
      estimatedLevel: lead.estimatedLevel,
      origin: lead.origin,
      website: lead.website,
      renderedAt: lead.renderedAt,
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? "Nao foi possivel enviar sua solicitacao agora.");
  }

  return response.json() as Promise<ApiResponse<LeadSubmissionResult>>;
}

export const leadService = {
  async submit(
    input: LeadSubmissionInput,
    options: LeadSubmissionOptions = {},
  ): Promise<ApiResponse<LeadSubmissionResult>> {
    const now = new Date().toISOString();
    const lead: LeadRequest = {
      ...input,
      fullName: input.fullName.trim(),
      email: input.email.trim(),
      whatsapp: input.whatsapp?.trim() || undefined,
      preferredSchedule: input.preferredSchedule?.trim() || undefined,
      message: input.message?.trim() || undefined,
      origin: input.origin?.trim() || getCurrentOrigin(),
      id: `lead-${shortCode()}`,
      createdAt: now,
    };

    const whatsappUrl = lead.preferredChannel === "whatsapp" ? buildWhatsAppUrl(lead) : null;
    if (lead.preferredChannel === "whatsapp" && !whatsappUrl) {
      throw new Error("Configure VITE_PUBLIC_WHATSAPP_NUMBER para usar o WhatsApp.");
    }

    if (env.leadsDataSource === "api") {
      const submission = submitLeadToApi({
        ...lead,
        website: input.website,
        renderedAt: input.renderedAt,
      });

      if (whatsappUrl && !options.deferWhatsApp) {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      }

      const response = await submission;

      if (whatsappUrl && !options.deferWhatsApp) {
        return {
          data: {
            ...response.data,
            status: "redirected",
            message:
              "Solicitação enviada por e-mail. Abrimos o WhatsApp com sua mensagem preenchida para você continuar.",
            whatsappUrl,
          },
        };
      }

      if (whatsappUrl) {
        return { data: { ...response.data, whatsappUrl } };
      }

      return response;
    }

    saveLocalLead(lead);

    if (whatsappUrl && !options.deferWhatsApp) {
      if (!options.deferWhatsApp) window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      return {
        data: {
          id: lead.id,
          status: "redirected",
          provider: "whatsapp-web",
          message: "Abrimos o WhatsApp com sua mensagem preenchida. Revise e envie por lá.",
          whatsappUrl,
          createdAt: now,
        },
      };
    }

    if (whatsappUrl) {
      return {
        data: {
          id: lead.id,
          status: "simulated",
          provider: "mock",
          message: "Dados registrados. Escolha como deseja continuar.",
          whatsappUrl,
          createdAt: now,
        },
      };
    }

    return {
      data: {
        id: lead.id,
        status: "simulated",
        provider: "mock",
        message: "Solicitacao registrada localmente. Nenhum e-mail real foi enviado em modo mock.",
        createdAt: now,
      },
    };
  },
};

function getCurrentOrigin(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return window.location.href;
}
