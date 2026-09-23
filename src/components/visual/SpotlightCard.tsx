import { createElement, type HTMLAttributes, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

type SpotlightCardProps = HTMLAttributes<HTMLElement> & {
  as?: "article" | "div" | "figure" | "li" | "section";
};

export function SpotlightCard({
  as = "div",
  className,
  onPointerMove,
  onPointerLeave,
  ...props
}: SpotlightCardProps) {
  const updateSpotlight = (event: PointerEvent<HTMLElement>) => {
    onPointerMove?.(event);
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spotlight-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--spotlight-y", `${event.clientY - bounds.top}px`);
  };

  const resetSpotlight = (event: PointerEvent<HTMLElement>) => {
    onPointerLeave?.(event);
    event.currentTarget.style.setProperty("--spotlight-x", "50%");
    event.currentTarget.style.setProperty("--spotlight-y", "50%");
  };

  return createElement(as, {
    ...props,
    className: cn("spotlight-card", className),
    onPointerMove: updateSpotlight,
    onPointerLeave: resetSpotlight,
  });
}
