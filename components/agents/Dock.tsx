"use client";

import { useSyncExternalStore } from "react";
import { Bot, BotOff, Clapperboard, Pause, Play } from "lucide-react";
import { agentActions, agentStore } from "@/lib/agents/controller";

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="hidden rounded border border-white/10 bg-white/5 px-1 font-mono text-[10px] leading-4 text-zinc-500 lg:inline-block">
      {children}
    </kbd>
  );
}

export default function Dock() {
  const s = useSyncExternalStore(agentStore.subscribe, agentStore.get, agentStore.getServer);
  if (!s.ready) return null;

  const pct = s.total > 0 ? Math.round((s.built / s.total) * 100) : 0;
  const building = s.enabled && !s.finished && !s.booting;
  const status = !s.enabled
    ? "Agents off"
    : s.booting
      ? "Booting agents…"
      : s.finished
        ? `Built by ${s.agentCount} agents`
        : s.paused
          ? `Paused · ${pct}%`
          : `${s.agentCount} agents · ${pct}%`;

  return (
    <>
      <div
        role="toolbar"
        aria-label="Build animation controls"
        className={`dock fixed bottom-4 left-1/2 z-[60] flex max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-zinc-950/90 p-1 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur transition-[opacity,transform] duration-300 ${
          s.touring || s.booting ? "pointer-events-none translate-y-24 opacity-0" : "opacity-100"
        }`}
      >
        <div className="hidden items-center gap-2 pr-2 pl-3 font-mono text-[11px] text-zinc-400 sm:flex" aria-live="polite">
          <span
            className={`size-1.5 rounded-full ${
              building && !s.paused ? "animate-pulse bg-accent" : s.enabled ? "bg-emerald-400" : "bg-zinc-600"
            }`}
          />
          <span className="tabular-nums whitespace-nowrap">{status}</span>
        </div>

        <button
          type="button"
          className="btn-dock"
          onClick={() => agentActions.togglePause()}
          disabled={!building}
          aria-pressed={s.paused}
          title="Pause / resume the build (P)"
        >
          {s.paused ? <Play className="size-3.5" aria-hidden /> : <Pause className="size-3.5" aria-hidden />}
          <span>{s.paused ? "Resume" : "Pause"}</span>
          <Kbd>P</Kbd>
        </button>

        <button
          type="button"
          className="btn-dock"
          onClick={() => agentActions.toggleAgents()}
          aria-pressed={s.enabled}
          title={s.enabled ? "Turn the robot agents off (A)" : "Turn agents on — replays the build (A)"}
        >
          {s.enabled ? <Bot className="size-3.5" aria-hidden /> : <BotOff className="size-3.5" aria-hidden />}
          <span>Agents {s.enabled ? "on" : "off"}</span>
          <Kbd>A</Kbd>
        </button>

        <button
          type="button"
          className="btn-dock btn-dock--accent"
          onClick={() => agentActions.startTour()}
          title="Reload and auto-scroll the whole site (T). Scroll or Esc to stop."
        >
          <Clapperboard className="size-3.5" aria-hidden />
          <span>Tour</span>
          <Kbd>T</Kbd>
        </button>
      </div>

      {s.touring && (
        <div className="tour-hint pointer-events-none fixed top-4 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-white/10 bg-zinc-950/90 px-3 py-1.5 font-mono text-[11px] text-zinc-400">
          Touring · scroll or <span className="text-zinc-200">Esc</span> to stop
        </div>
      )}
    </>
  );
}
