import { Link, useRouterState } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Instagram, Mail, Menu, MessageCircle, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { buildWhatsAppContactUrl } from "@/utils/contact";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/planos", label: "Planos" },
  { to: "/agendar", label: "Aula experimental" },
  { to: "/nivel", label: "Teste de nível" },
  { to: "/como-funciona", label: "Como funciona" },
  { to: "/contato", label: "Contato" },
] as const;

function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn("font-display text-2xl leading-none tracking-tight text-foreground", className)}
    >
      nerya<span className="text-brand">.</span>
    </span>
  );
}

export function PublicLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const whatsappUrl = buildWhatsAppContactUrl(
    "Olá, gostaria de falar com a Nerya sobre as aulas de inglês.",
  );

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    trackEvent("page_view", { path: pathname });
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-colors duration-200",
          scrolled
            ? "border-border bg-background/85 backdrop-blur-md"
            : "border-transparent bg-background/60 backdrop-blur",
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-6 md:h-[72px]">
          <Link to="/" className="flex shrink-0 items-center" aria-label="Nerya — Início">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{
                  className:
                    "text-foreground after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-[2px] after:rounded-full after:bg-brand",
                }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Button
              asChild
              size="sm"
              className="bg-brand text-primary-foreground hover:bg-brand-dark"
            >
              <Link
                to="/agendar"
                onClick={() => trackEvent("cta_trial_click", { location: "header_desktop" })}
              >
                Aula experimental
              </Link>
            </Button>
          </div>

          <button
            className="rounded-md p-2 text-foreground transition-colors hover:bg-surface lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div className={cn("border-t border-border lg:hidden", open ? "block" : "hidden")}>
          <div className="container-page flex flex-col gap-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-surface hover:text-foreground"
                activeProps={{ className: "bg-surface text-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Button
                asChild
                size="sm"
                className="flex-1 bg-brand text-primary-foreground hover:bg-brand-dark"
              >
                <Link
                  to="/agendar"
                  onClick={() => trackEvent("cta_trial_click", { location: "header_mobile" })}
                >
                  Aula experimental
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-[color:var(--background-soft)]">
        <div className="container-page grid gap-10 py-14 md:grid-cols-4">
          <div>
            <Logo className="text-3xl" />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Inglês online que conecta. Aulas particulares ao vivo, conversação e acompanhamento
              individual.
            </p>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Aulas
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/planos" className="transition hover:text-foreground">
                  Planos
                </Link>
              </li>
              <li>
                <Link to="/agendar" className="transition hover:text-foreground">
                  Aula experimental
                </Link>
              </li>
              <li>
                <Link to="/nivel" className="transition hover:text-foreground">
                  English Check
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Institucional
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/como-funciona" className="transition hover:text-foreground">
                  Como funciona
                </Link>
              </li>
              <li>
                <Link to="/contato" className="transition hover:text-foreground">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="transition hover:text-foreground">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Atendimento
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Sua aula experimental é grátis. Envie o formulário e combine os próximos passos pelo
              WhatsApp.
            </p>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              onClick={() => trackEvent("contact_click", { location: "footer_email" })}
              className="mt-4 inline-flex items-center gap-2 text-xs text-brand-light transition hover:text-foreground"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              {siteConfig.contact.email}
            </a>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="container-page flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} Nerya. Todos os direitos reservados.</span>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Feito com foco em fluência.
              </span>
              <a
                href={siteConfig.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Nerya"
                title="Instagram @somosnerya"
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
                <span>{siteConfig.contact.instagramHandle}</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar com a Nerya pelo WhatsApp"
          title="Falar pelo WhatsApp"
          onClick={() =>
            trackEvent("whatsapp_click", { location: "floating_button", path: pathname })
          }
          className="fixed bottom-5 right-4 z-50 grid h-14 w-14 place-items-center rounded-full border-4 border-white/80 bg-[#25D366] text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition duration-200 hover:scale-105 hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 md:bottom-7 md:right-7 md:h-16 md:w-16"
        >
          <MessageCircle className="h-7 w-7 md:h-8 md:w-8" strokeWidth={2.5} aria-hidden="true" />
          <span className="sr-only">WhatsApp</span>
        </a>
      )}
    </div>
  );
}
