/**
 * Slow, cinematic auto-scroll of the whole page for screen recording.
 * Eases in, cruises at a steady speed, eases out. Slows down while agents
 * still have on-screen work so the recording shows elements being built.
 * Any wheel / touch / key / pointer input from the visitor cancels it.
 */

export type TourOptions = {
  /** Wait this long at the start before moving (still cancellable). */
  holdStartMs?: number;
  /** Stay at the bottom this long before the tour counts as finished. */
  holdEndMs?: number;
  /** Number of on-screen elements still waiting to be built. */
  backlog?: () => number;
  /** Called once; reason is "completed" or what cancelled it (wheel, touch, pointer, key:…, stopped). */
  onEnd?: (reason: string) => void;
};

import { dlog } from "./config";

const RAMP_MS = 1600;

export function runAutoScroll({ backlog, onEnd, holdStartMs = 0, holdEndMs = 0 }: TourOptions = {}): (reason?: string) => void {
  const vh = window.innerHeight;
  const cruise = Math.min(170, Math.max(95, vh * 0.15)) / 1000; // px per ms
  const brake = cruise * RAMP_MS * 0.6; // distance over which we ease out

  let pos = window.scrollY;
  let elapsed = 0;
  let throttle = 1;
  let last = performance.now();
  let raf = 0;
  let done = false;
  let waited = 0;
  let bottomFor = 0;
  let loggedMove = false;
  dlog(`tour loop started (hold ${holdStartMs}ms, then ${Math.round(cruise * 1000)}px/s)`);

  const end = (reason = "stopped") => {
    if (done) return;
    done = true;
    cancelAnimationFrame(raf);
    window.removeEventListener("wheel", cancel);
    window.removeEventListener("touchstart", cancel);
    window.removeEventListener("pointerdown", cancel);
    window.removeEventListener("keydown", onKey);
    onEnd?.(reason);
  };
  const cancel = (e: Event) => end(e.type);
  const onKey = (e: KeyboardEvent) => {
    const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Escape"];
    if (keys.includes(e.key)) end(`key:${e.key}`);
  };

  window.addEventListener("wheel", cancel, { passive: true });
  window.addEventListener("touchstart", cancel, { passive: true });
  window.addEventListener("pointerdown", cancel, { passive: true });
  window.addEventListener("keydown", onKey);

  const step = (now: number) => {
    if (done) return;
    const dt = Math.min(now - last, 50);
    last = now;

    // Opening hold: stay still before the camera starts moving.
    if (waited < holdStartMs) {
      waited += dt;
      raf = requestAnimationFrame(step);
      return;
    }
    elapsed += dt;
    if (!loggedMove) {
      loggedMove = true;
      dlog("tour scrolling", { from: Math.round(pos), to: document.documentElement.scrollHeight - window.innerHeight });
    }

    const max = document.documentElement.scrollHeight - window.innerHeight;
    const remaining = max - pos;
    if (remaining <= 0.5) {
      window.scrollTo({ top: max, behavior: "instant" });
      // Closing hold: rest on the footer before finishing.
      if (bottomFor === 0) dlog(`reached bottom, holding ${holdEndMs}ms`);
      bottomFor += dt;
      if (bottomFor >= holdEndMs) {
        end("completed");
        return;
      }
      raf = requestAnimationFrame(step);
      return;
    }

    // Ease in: smoothstep over the first RAMP_MS.
    const t = Math.min(1, elapsed / RAMP_MS);
    const easeIn = t * t * (3 - 2 * t);
    // Ease out: constant deceleration as we approach the bottom.
    const easeOut = Math.min(1, Math.sqrt(remaining / brake));
    // Let the agents catch up when lots is still unbuilt on screen.
    const target = backlog && backlog() > 5 ? 0.35 : 1;
    throttle += (target - throttle) * 0.04;

    const v = cruise * Math.max(0.02, easeIn * easeOut * throttle);
    pos = Math.min(max, pos + v * dt);
    window.scrollTo({ top: pos, behavior: "instant" });
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);

  return end;
}
