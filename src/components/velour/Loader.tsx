import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function Loader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1600);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] grid place-items-center bg-background"
        >
          <div className="relative flex flex-col items-center gap-6">
            <div className="relative h-20 w-20">
              <span className="absolute inset-0 rounded-full border border-[var(--gold)]/30" />
              <span className="absolute inset-0 rounded-full border-t-2 border-[var(--gold)] animate-spin-slow" />
              <span className="absolute inset-3 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--ember)] blur-md opacity-70" />
              <span className="absolute inset-3 grid place-items-center rounded-full bg-background font-display text-lg">V</span>
            </div>
            <div className="overflow-hidden">
              <motion.span
                initial={{ y: 24 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8 }}
                className="block font-display text-2xl tracking-[0.4em] text-muted-foreground"
              >
                The Ceylon Ember
              </motion.span>
            </div>
            <div className="h-px w-48 overflow-hidden bg-border">
              <motion.span
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
                className="block h-full w-1/2 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
