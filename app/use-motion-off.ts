"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;

/**
 * True when the visitor asked for reduced motion.
 *
 * The preference is a media query, so it cannot be read while rendering on the
 * server. Reading it through `useSyncExternalStore` lets the hydration pass use
 * the server's answer — motion on — and React re-renders with the real value
 * straight after, instead of the two disagreeing mid-hydration.
 */
export function useMotionOff() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
