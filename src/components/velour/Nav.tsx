import { motion } from "framer-motion";

const links = ["Dishes", "Chefs", "About", "Reviews", "Reserve"];

export function Nav() {
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-1/2 top-6 z-50 -translate-x-1/2"
    >
      <div className="glass-strong flex items-center gap-2 rounded-full px-3 py-2 shadow-2xl">
        <a href="#hero" className="flex items-center gap-2 rounded-full px-4 py-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--ember)] text-[10px] font-bold text-primary-foreground">
            Q
          </span>
          <span className="font-display text-lg tracking-wide">The Ceylon Ember</span>
        </a>
        <div className="mx-1 hidden h-6 w-px bg-border md:block" />
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l}>
              <a
                href={`#${l.toLowerCase()}`}
                className="group relative rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l}
                <span className="pointer-events-none absolute inset-x-4 -bottom-px h-px scale-x-0 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#reserve"
          className="ml-1 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--ember)] px-5 py-2 text-sm font-medium text-primary-foreground shadow-[0_8px_30px_-8px_oklch(0.82_0.16_78_/_0.6)] transition-transform hover:scale-[1.03]"
        >
          Book
        </a>
      </div>
    </motion.nav>
  );
}
