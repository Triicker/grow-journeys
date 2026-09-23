import { AlertCircle } from "lucide-react";

export function DemoBanner({ children }: { children?: React.ReactNode }) {
  return (
    <div className="neon-badge flex items-start gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-brand-light">
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>{children ?? "Ambiente demonstrativo — nenhuma ação real é executada."}</span>
    </div>
  );
}
