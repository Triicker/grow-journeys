import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarPlus, CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicLayout } from "@/layouts/PublicLayout";
import { downloadIcs, googleCalendarUrl } from "@/features/booking/calendar";
import { bookingStorage } from "@/features/booking/storage";
import type { BookingConfirmation } from "@/features/booking/types";

export const Route = createFileRoute("/agendar/confirmado")({
  head: () => ({
    meta: [{ title: "Aula confirmada — Nerya" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: BookingConfirmedPage,
});

function BookingConfirmedPage() {
  const [booking, setBooking] = useState<BookingConfirmation | null>(null);
  useEffect(() => setBooking(bookingStorage.getConfirmation()), []);
  return (
    <PublicLayout>
      <section className="container-page py-16">
        <div className="surface-premium mx-auto max-w-2xl rounded-2xl border border-border bg-card p-7 text-center md:p-10">
          {booking ? (
            <>
              <CheckCircle2 className="mx-auto h-12 w-12 text-brand-light" />
              <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-brand-light">
                Reserva confirmada
              </p>
              <h1 className="mt-3 font-display text-4xl">Sua aula está na agenda</h1>
              <p className="mt-4 text-muted-foreground">
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "full",
                  timeStyle: "short",
                  timeZone: booking.timezone,
                }).format(new Date(booking.startsAt))}{" "}
                — horário de Salvador.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <a href={googleCalendarUrl(booking)} target="_blank" rel="noopener noreferrer">
                    <CalendarPlus className="h-4 w-4" /> Google Calendar
                  </a>
                </Button>
                <Button variant="outline" onClick={() => downloadIcs(booking)}>
                  <Download className="h-4 w-4" /> Baixar .ics
                </Button>
                <Button asChild variant="ghost">
                  <Link to="/">Voltar ao início</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <h1 className="font-display text-4xl">Nenhuma reserva encontrada</h1>
              <p className="mt-4 text-muted-foreground">
                A confirmação só aparece depois que um provedor real conclui o agendamento.
              </p>
              <Button asChild className="mt-6">
                <Link to="/agendar">Solicitar aula experimental</Link>
              </Button>
            </>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
