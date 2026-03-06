"use client";
import { useEffect } from "react";

export function ViewportFix() {
  useEffect(() => {
    const setViewport = () => {
      const vh = window.visualViewport
        ? window.visualViewport.height * 0.01
        : window.innerHeight * 0.01;

      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setViewport();

    window.visualViewport?.addEventListener("resize", setViewport);
    window.addEventListener("resize", setViewport);

    return () => {
      window.visualViewport?.removeEventListener("resize", setViewport);
      window.removeEventListener("resize", setViewport);
    };
  }, []);

  return null;
}