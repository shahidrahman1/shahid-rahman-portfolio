import { AGENTS } from "@/lib/agents/config";

/**
 * Server-rendered so it is on screen from the very first paint.
 * Only visible while <html> has `build-mode` and not yet `boot-done`.
 */
export default function BootLoader() {
  return (
    <div className="boot" aria-hidden="true">
      <div className="w-[min(320px,80vw)] font-mono text-[11px] text-zinc-500">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-zinc-300">
            <span className="text-accent">●</span> portfolio.build
          </span>
          <span className="boot-pct" />
        </div>
        <div className="h-px w-full overflow-hidden bg-white/10">
          <div className="boot-bar h-full bg-accent" />
        </div>
        <ul className="mt-4 grid grid-cols-3 gap-x-3 gap-y-1">
          {AGENTS.map((a, i) => (
            <li key={a.name} className="boot-line" style={{ animationDelay: `${120 + i * 60}ms` }}>
              <span style={{ color: a.color }}>▸</span> {a.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
