import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarDays, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicLayout } from "@/layouts/PublicLayout";
import { bookingStorage } from "@/features/booking/storage";
import { getPublicBookingProvider } from "@/features/booking/provider";
import type { BookingSlot, PublicLeadHandoff } from "@/features/booking/types";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/agendar/horario")({
  head: () => ({
    meta: [{ title: "Escolher horário — Nerya" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: PublicBookingPage,
});

function PublicBookingPage() {
  const navigate = useNavigate();
  const [lead, setLead] = useState<PublicLeadHandoff | null>(null);
  const [dates, setDates] = useState<string[]>([]);
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot>();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [submitting, setSubmitting] = useState(false);
  const provider = getPublicBookingProvider();

  useEffect(() => {
    const storedLead = bookingStorage.getLead();
    setLead(storedLead);
    trackEvent("booking_start", { provider_available: provider.isAvailable() });
    provider
      .getAvailableDates()
      .then((availableDates) => {
        setDates(availableDates);
        setStatus("ready");
      })
      .catch(() => {
        setStatus("error");
        trackEvent("booking_error", { stage: "dates" });
      });
  }, [provider]);

  const chooseDate = async (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(undefined);
    trackEvent("booking_date_select");
    try {
      setSlots(await provider.getAvailableSlots(date));
    } catch {
      setStatus("error");
      trackEvent("booking_error", { stage: "slots" });
    }
  };

  const submit = async () => {
    if (!lead || !selectedSlot || submitting) return;
    setSubmitting(true);
    trackEvent("booking_submit");
    try {
      const confirmation = await provider.createBooking(selectedSlot, lead);
      bookingStorage.setConfirmation(confirmation);
      trackEvent("booking_success");
      await navigate({ to: "/agendar/confirmado" });
    } catch {
      setStatus("error");
      trackEvent("booking_error", { stage: "submit" });
    } finally {
      setSubmitting(false);
    }
  };

  const fallback = () =>
    trackEvent("booking_whatsapp_fallback", {
      reason: provider.isAvailable() ? "no_slots" : "provider_unavailable",
    });

  return (
    <PublicLayout>
      <section className="container-page py-12 md:py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 md:p-9">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
            Agenda pública
          </p>
          <h1 className="mt-3 font-display text-4xl">Escolha um horário</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Horários exibidos no fuso de Salvador (America/Bahia). Você não precisa criar uma conta.
          </p>

          {!lead ? (
            <div className="mt-7 rounded-lg border border-border bg-surface p-5">
              <p className="text-sm text-muted-foreground">
                Primeiro envie seus dados para podermos identificar sua solicitação.
              </p>
              <Button asChild className="mt-4">
                <Link to="/agendar">Ir para o formulário</Link>
              </Button>
            </div>
          ) : status === "loading" ? (
            <p className="mt-8" role="status">
              Consultando disponibilidade...
            </p>
          ) : dates.length === 0 ? (
            <div className="mt-8 rounded-xl border border-brand/30 bg-brand/10 p-6">
              <CalendarDays className="h-6 w-6 text-brand-light" aria-hidden="true" />
              <h2 className="mt-3 font-display text-2xl">Agenda online ainda não disponível</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Não vamos simular uma reserva. Combine um horário diretamente com a Nerya pelo
                WhatsApp.
              </p>
              {lead.whatsappUrl ? (
                <Button
                  asChild
                  className="mt-5 bg-brand text-primary-foreground hover:bg-brand-dark"
                >
                  <a
                    href={lead.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={fallback}
                  >
                    <MessageCircle className="h-4 w-4" /> Combinar pelo WhatsApp
                  </a>
                </Button>
              ) : (
                <p className="mt-4 text-sm">
                  O WhatsApp institucional não está configurado. Responderemos pelo e-mail
                  informado.
                </p>
              )}
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              <fieldset>
                <legend className="font-display text-xl">Datas disponíveis</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {dates.map((date) => (
                    <Button
                      key={date}
                      variant={selectedDate === date ? "default" : "outline"}
                      onClick={() => chooseDate(date)}
                    >
                      {new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "medium",
                        timeZone: "America/Bahia",
                      }).format(new Date(`${date}T12:00:00-03:00`))}
                    </Button>
                  ))}
                </div>
              </fieldset>
              {selectedDate && (
                <fieldset>
                  <legend className="font-display text-xl">Horários</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {slots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                        onClick={() => {
                          setSelectedSlot(slot);
                          trackEvent("booking_time_select");
                        }}
                      >
                        {new Intl.DateTimeFormat("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "America/Bahia",
                        }).format(new Date(slot.startsAt))}
                      </Button>
                    ))}
                  </div>
                </fieldset>
              )}
              <Button disabled={!selectedSlot || submitting} onClick={submit}>
                {submitting ? "Confirmando..." : "Confirmar horário"}
              </Button>
            </div>
          )}
          {status === "error" && (
            <p role="alert" className="mt-5 text-sm text-destructive">
              Não foi possível consultar ou confirmar a agenda. Tente o atendimento por WhatsApp.
            </p>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
