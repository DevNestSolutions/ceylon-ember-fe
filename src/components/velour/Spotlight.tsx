import { useEffect, useRef } from "react";

export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      el.style.setProperty("--mx", `${e.clientX}px`);
      el.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-40"
      style={{
        background:
          "radial-gradient(360px circle at var(--mx,50%) var(--my,50%), oklch(0.82 0.16 78 / 0.10), transparent 60%)",
        mixBlendMode: "screen",
      }}
    />
  );
}
