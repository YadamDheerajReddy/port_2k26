"use client";

import { useEffect, useState } from "react";

/** Gates cursor-follow, magnetic hover, and card tilt to non-touch devices. */
export function usePointerFine() {
  const [pointerFine, setPointerFine] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    setPointerFine(query.matches);

    const handleChange = (event: MediaQueryListEvent) => setPointerFine(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return pointerFine;
}
