export function Particles({ count = 30 }: { count?: number }) {
  const items = Array.from({ length: count });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((_, i) => {
        const left = (i * 37) % 100;
        const size = 2 + ((i * 13) % 5);
        const dur = 14 + ((i * 7) % 18);
        const delay = (i * 1.3) % 12;
        const dx = ((i % 2 === 0 ? 1 : -1) * (20 + (i % 60))) + "px";
        return (
          <span
            key={i}
            className="absolute bottom-0 rounded-full"
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              background:
                "radial-gradient(circle, oklch(0.88 0.12 80 / 0.9), oklch(0.68 0.20 45 / 0.2) 60%, transparent 70%)",
              filter: "blur(0.5px)",
              animation: `drift ${dur}s linear ${delay}s infinite`,
              ["--dx" as any]: dx,
            }}
          />
        );
      })}
    </div>
  );
}
