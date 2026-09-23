export type AnalyticsEventName =
  | "page_view"
  | "cta_trial_click"
  | "plans_view"
  | "plan_select"
  | "trial_form_view"
  | "trial_form_start"
  | "trial_form_submit"
  | "trial_form_success"
  | "trial_form_error"
  | "whatsapp_click"
  | "contact_click"
  | "faq_open"
  | "teacher_section_view"
  | "testimonial_view";

export type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

export type AnalyticsEvent = {
  name: AnalyticsEventName;
  properties: AnalyticsProperties;
  timestamp: string;
};

export interface AnalyticsProvider {
  track(event: AnalyticsEvent): void | Promise<void>;
}

const providers = new Set<AnalyticsProvider>();

export function registerAnalyticsProvider(provider: AnalyticsProvider): () => void {
  providers.add(provider);
  return () => providers.delete(provider);
}

export function trackEvent(name: AnalyticsEventName, properties: AnalyticsProperties = {}): void {
  const event: AnalyticsEvent = {
    name,
    properties,
    timestamp: new Date().toISOString(),
  };

  for (const provider of providers) {
    try {
      Promise.resolve(provider.track(event)).catch(() => undefined);
    } catch {
      // Analytics must never interrupt the visitor's flow.
    }
  }
}
