"use client";

import { useEffect } from "react";
import {
  AUTOTOUR_HOLD_MS,
  AUTOTOUR_PARAM,
  BOOT_MS,
  STORAGE_KEY,
  TOUR_KEY,
  agentCountForViewport,
  dlog,
} from "@/lib/agents/config";
import { agentActions, agentStore, registerActions } from "@/lib/agents/controller";
import { AgentEngine } from "@/lib/agents/engine";
import { runAutoScroll } from "@/lib/agents/tour";

/**
 * Once the auto tour has started (or been cancelled) on this page load it never
 * starts again — survives React StrictMode's double effect and any re-mounts.
 */
let autotourConsumed = false;

function save(value: "on" | "off") {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* storage unavailable (private mode) — toggle still works for this page */
  }
}

/** Remove query params without reloading (e.g. so a later reload doesn't re-trigger them). */
function removeParams(...names: string[]) {
  const url = new URL(window.location.href);
  let changed = false;
  for (const n of names) {
    if (url.searchParams.has(n)) {
      url.searchParams.delete(n);
      changed = true;
    }
  }
  if (changed) window.history.replaceState(null, "", url.toString());
}

/**
 * Boots the robot-cursor build animation, wires up keyboard shortcuts and the tour.
 * Renders nothing; the cursors are plain DOM nodes driven by AgentEngine.
 *
 * Tours:
 *  - Manual: Tour button / T  → reload, build hero, auto-scroll.
 *  - Auto:   ?autotour=on     → agents forced on, build hero, hold 2s, auto-scroll,
 *                               hold 2s at the bottom. Runs once per visit to that URL.
 */
export default function AgentLayer() {
  useEffect(() => {
    const html = document.documentElement;
    const enabled = html.dataset.agents === "on";
    const autotour = html.dataset.autotour === "on" && !autotourConsumed;
    let tourRequested = false;
    try {
      tourRequested = sessionStorage.getItem(TOUR_KEY) === "1";
    } catch {
      /* ignore */
    }

    let engine: AgentEngine | null = null;
    let stopTourFn: ((reason?: string) => void) | null = null;
    let tourStarted = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    dlog("AgentLayer mounted", { enabled, autotour, manualTourRequested: tourRequested });

    const runTour = (auto = false) => {
      if (tourStarted) {
        dlog("runTour ignored: a tour already ran on this page load");
        return; // never run two tours on one page load
      }
      tourStarted = true;
      dlog(`runTour(${auto ? "auto" : "manual"}) → scrolling ${document.documentElement.scrollHeight - window.innerHeight}px`);
      if (auto) {
        autotourConsumed = true;
        detachEarlyCancel();
        // Drop ?autotour=on so reloads / Agents toggle / Tour don't restart it.
        removeParams(AUTOTOUR_PARAM);
        html.removeAttribute("data-autotour");
      }
      try {
        sessionStorage.removeItem(TOUR_KEY);
        history.scrollRestoration = "auto";
      } catch {
        /* ignore */
      }
      agentStore.set({ touring: true });
      stopTourFn = runAutoScroll({
        holdStartMs: auto ? AUTOTOUR_HOLD_MS : 0,
        holdEndMs: auto ? AUTOTOUR_HOLD_MS : 0,
        backlog: () => (engine && !engine.isFinished ? engine.backlog() : 0),
        onEnd: (reason) => {
          dlog(`tour ended: ${reason}`);
          stopTourFn = null;
          agentStore.set({ touring: false });
        },
      });
    };

    // If the visitor scrolls or presses Esc *before* the auto tour begins
    // (while the hero is still building), cancel it so it never hijacks the page.
    const cancelPendingAutotour = (e?: Event) => {
      if (tourStarted || !autotour) return;
      dlog(`auto tour cancelled before it started (${e?.type ?? "input"})`);
      tourStarted = true;
      autotourConsumed = true;
      removeParams(AUTOTOUR_PARAM);
      html.removeAttribute("data-autotour");
      detachEarlyCancel();
    };
    const onEarlyKey = (e: KeyboardEvent) => {
      const keys = ["Escape", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
      if (keys.includes(e.key)) cancelPendingAutotour(e);
    };
    function detachEarlyCancel() {
      window.removeEventListener("wheel", cancelPendingAutotour);
      window.removeEventListener("touchstart", cancelPendingAutotour);
      window.removeEventListener("keydown", onEarlyKey);
    }
    if (autotour) {
      window.addEventListener("wheel", cancelPendingAutotour, { passive: true });
      window.addEventListener("touchstart", cancelPendingAutotour, { passive: true });
      window.addEventListener("keydown", onEarlyKey);
    }

    const agentCount = agentCountForViewport(window.innerWidth);

    registerActions({
      togglePause() {
        const s = agentStore.get();
        if (!engine || s.finished || s.booting) return;
        engine.setPaused(!s.paused);
        agentStore.set({ paused: !s.paused });
      },
      toggleAgents() {
        removeParams("agents", AUTOTOUR_PARAM);
        if (agentStore.get().enabled) {
          save("off");
          engine?.finishAll();
          html.setAttribute("data-agents", "off");
          html.classList.add("boot-done");
          agentStore.set({ enabled: false, paused: false, booting: false, finished: true });
        } else {
          save("on");
          window.location.reload();
        }
      },
      startTour() {
        dlog("Tour button → reloading to run the tour");
        removeParams(AUTOTOUR_PARAM);
        try {
          sessionStorage.setItem(TOUR_KEY, "1");
          history.scrollRestoration = "manual";
        } catch {
          /* ignore */
        }
        window.scrollTo({ top: 0, behavior: "instant" });
        window.location.reload();
      },
      stopTour() {
        stopTourFn?.();
      },
    });

    if (enabled) {
      agentStore.set({ ready: true, enabled: true, booting: true, finished: false, agentCount });
      const wait = Math.max(300, BOOT_MS - performance.now());
      later(() => {
        html.classList.add("boot-done");
        engine = new AgentEngine({
          agentCount,
          onProgress: (built, total) => agentStore.set({ built, total }),
          onHeroBuilt: () => {
            dlog("onHeroBuilt", { autotour, manualTourRequested: tourRequested });
            if (autotour) later(() => runTour(true), 0); // the 2s opening hold lives in runAutoScroll
            else if (tourRequested) later(() => runTour(false), 700);
          },
          onFinished: () => agentStore.set({ finished: true, paused: false }),
        });
        agentStore.set({ booting: false, total: engine.total });
        engine.start();
      }, wait);
    } else {
      html.classList.add("boot-done");
      agentStore.set({ ready: true, enabled: false, booting: false, finished: true, agentCount });
      if (tourRequested) later(() => runTour(false), 600);
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const key = e.key.toLowerCase();
      if (key === "escape") {
        stopTourFn?.("key:Escape");
        return;
      }
      if (agentStore.get().touring) return;
      if (key === "t") agentActions.startTour();
      else if (key === "a") agentActions.toggleAgents();
      else if (key === "p") agentActions.togglePause();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("keydown", onKey);
      detachEarlyCancel();
      stopTourFn?.();
      engine?.destroy();
      engine = null;
    };
  }, []);

  return null;
}
