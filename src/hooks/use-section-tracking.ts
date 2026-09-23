import { useEffect, useRef } from "react";
import { trackEvent, type AnalyticsEventName, type AnalyticsProperties } from "@/lib/analytics";

export function useSectionTracking<T extends HTMLElement>(
  eventName: AnalyticsEventName | null,
  properties: AnalyticsProperties = {},
) {
  const elementRef = useRef<T>(null);
  const trackedRef = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !eventName || trackedRef.current) return;

    if (!("IntersectionObserver" in window)) {
      trackedRef.current = true;
      trackEvent(eventName, properties);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || trackedRef.current) return;
        trackedRef.current = true;
        trackEvent(eventName, properties);
        observer.disconnect();
      },
      { threshold: 0.3 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [eventName, properties]);

  return elementRef;
}
