import { AGENTS, ENGINE_VERSION, MAX_CONCURRENT, dlog } from "./config";
import { ARROW_SVG, robotSvg } from "./robot";

/**
 * AgentEngine — robot cursors that "build" the page.
 *
 * Every element marked data-build="type" | "pop" | "wipe" starts hidden (via the
 * `build-mode` class set in <head>). When it scrolls into view an idle agent glides
 * to it, drags out a wireframe box, then reveals it. One requestAnimationFrame loop
 * drives everything; an IntersectionObserver decides what is eligible.
 */

type Mode = "type" | "pop" | "wipe";

type Job = {
  el: HTMLElement;
  mode: Mode;
  index: number;
  state: "pending" | "active" | "done";
  /** Has been inside the viewport, so an agent may build it. */
  eligible: boolean;
  /** The IntersectionObserver has reported on it at least once. */
  seen: boolean;
  inHero: boolean;
};

type Phase = "idle" | "move" | "draw" | "reveal" | "release" | "park";

type TypeRun = {
  chars: HTMLSpanElement[];
  swaps: { orig: Text; wrap: HTMLSpanElement }[];
  shown: number;
};

type Agent = {
  name: string;
  color: string;
  slot: number;
  root: HTMLDivElement;
  box: HTMLDivElement;
  boxLabel: HTMLSpanElement;
  boxDims: HTMLSpanElement;
  x: number;
  y: number;
  fromX: number;
  fromY: number;
  opacity: number;
  phase: Phase;
  t0: number;
  dur: number;
  job: Job | null;
  idleSince: number;
  parked: boolean;
  typing: TypeRun | null;
  boxAlpha: number;
};

type Rect = { left: number; top: number; width: number; height: number };

const DRAW_MS = 420;
const RELEASE_MS = 260;
const POP_MS = 540;
const WIPE_MS = 760;
const ASSIGN_GAP_MS = 95;
const PARK_AFTER_MS = 1400;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export type EngineOptions = {
  agentCount: number;
  onProgress?: (built: number, total: number) => void;
  onHeroBuilt?: () => void;
  onFinished?: () => void;
};

export class AgentEngine {
  private jobs: Job[] = [];
  private heroJobs: Job[] = [];
  private agents: Agent[] = [];
  private layer: HTMLDivElement | null = null;
  private observer: IntersectionObserver | null = null;
  private raf = 0;
  private last = 0;
  private clock = 0;
  private frame = 0;
  private lastAssign = -Infinity;
  private paused = false;
  private built = 0;
  private heroDone = false;
  private finishedAt = -1;
  private stopped = false;
  private animListeners = new Map<HTMLElement, () => void>();

  constructor(private opts: EngineOptions) {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-build]"));
    this.jobs = els.map((el, index) => {
      const raw = el.dataset.build;
      const mode: Mode = raw === "type" || raw === "wipe" ? raw : "pop";
      return { el, mode, index, state: "pending", eligible: false, seen: false, inHero: !!el.closest("[data-hero]") };
    });
    this.heroJobs = this.jobs.filter((j) => j.inHero);
    if (process.env.NODE_ENV !== "production") {
      for (const j of this.jobs) {
        if (j.el.parentElement?.closest("[data-build]")) {
          console.warn("[agents] nested data-build is not supported:", j.el);
        }
      }
    }
  }

  get total() {
    return this.jobs.length;
  }

  start() {
    document.documentElement.dataset.agentsEngine = ENGINE_VERSION;
    dlog(`engine ${ENGINE_VERSION} start`, {
      elements: this.jobs.length,
      heroElements: this.heroJobs.length,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      agents: this.opts.agentCount,
    });
    if (this.heroJobs.length === 0) dlog("WARNING: no [data-build] elements inside [data-hero]");
    // Elements that aren't rendered at this breakpoint (display:none) can never intersect.
    for (const job of this.jobs) {
      if (job.el.getClientRects().length === 0) this.revealInstant(job);
    }
    this.buildLayer();
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const job = this.jobs.find((j) => j.el === entry.target);
          if (job) job.seen = true;
          if (!entry.isIntersecting) continue;
          if (job) job.eligible = true;
          this.observer?.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0 },
    );
    for (const job of this.jobs) if (job.state === "pending") this.observer.observe(job.el);
    this.scanScrolledPast();
    this.emitProgress();
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  /** Elements on screen still waiting for an agent — the tour slows down while this is high. */
  backlog(): number {
    let n = 0;
    for (const j of this.jobs) if (j.state !== "done" && j.eligible) n++;
    return n;
  }

  get isFinished() {
    return this.stopped;
  }

  setPaused(paused: boolean) {
    this.paused = paused;
    document.documentElement.classList.toggle("agents-paused", paused);
  }

  /** Reveal everything immediately and tear down cursors. */
  finishAll() {
    for (const agent of this.agents) {
      if (agent.typing) this.restoreType(agent.typing);
      agent.typing = null;
    }
    for (const job of this.jobs) {
      if (job.state !== "done") this.revealInstant(job);
      this.clearAnim(job.el);
    }
    this.teardown();
  }

  destroy() {
    this.finishAll();
  }

  // ---------------------------------------------------------------- setup

  private buildLayer() {
    const layer = document.createElement("div");
    layer.className = "agent-layer";
    layer.setAttribute("aria-hidden", "true");
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const n = this.opts.agentCount;

    for (let i = 0; i < n; i++) {
      const def = AGENTS[i % AGENTS.length];
      const box = document.createElement("div");
      box.className = "wire";
      box.innerHTML =
        '<i class="wire-h tl"></i><i class="wire-h tr"></i><i class="wire-h bl"></i><i class="wire-h br"></i>' +
        '<span class="wire-label"><span class="wire-tag"></span><span class="wire-dims"></span></span>';
      const root = document.createElement("div");
      root.className = "agent";
      root.style.setProperty("--agent", def.color);
      root.innerHTML = `${ARROW_SVG}<div class="agent-tag">${robotSvg(i * 0.37)}<span>${def.name}</span></div>`;
      layer.appendChild(box);
      layer.appendChild(root);

      // Spawn just below the viewport, spread across the width.
      const x = ((i + 0.5) / n) * vw;
      const y = vh + 40 + (i % 3) * 18;
      this.agents.push({
        name: def.name,
        color: def.color,
        slot: i,
        root,
        box,
        boxLabel: box.querySelector(".wire-tag") as HTMLSpanElement,
        boxDims: box.querySelector(".wire-dims") as HTMLSpanElement,
        x,
        y,
        fromX: x,
        fromY: y,
        opacity: 0,
        phase: "idle",
        t0: 0,
        dur: 0,
        job: null,
        idleSince: -Infinity,
        parked: true,
        typing: null,
        boxAlpha: 0,
      });
    }
    document.body.appendChild(layer);
    this.layer = layer;
  }

  private teardown() {
    if (this.stopped) return;
    this.stopped = true;
    cancelAnimationFrame(this.raf);
    this.observer?.disconnect();
    this.observer = null;
    const layer = this.layer;
    this.layer = null;
    if (layer) {
      layer.classList.add("agent-layer--out");
      window.setTimeout(() => layer.remove(), 450);
    }
    document.documentElement.classList.remove("agents-paused");
    document.documentElement.classList.remove("build-mode");
    if (!this.heroDone) {
      this.heroDone = true;
      this.opts.onHeroBuilt?.();
    }
    this.emitProgress();
    this.opts.onFinished?.();
  }

  // ---------------------------------------------------------------- loop

  private tick = (ts: number) => {
    if (this.stopped) return;
    const dt = Math.min(ts - this.last, 64);
    this.last = ts;
    if (!this.paused) this.clock += dt;
    this.frame++;

    if (this.frame % 4 === 0) this.scanScrolledPast();
    if (!this.paused) this.assign();
    for (const agent of this.agents) this.updateAgent(agent);
    for (const agent of this.agents) this.render(agent);
    this.checkHero();

    if (this.built === this.jobs.length) {
      if (this.finishedAt < 0) this.finishedAt = this.clock;
      const allIdle = this.agents.every((a) => a.phase === "idle" || a.phase === "park");
      if (allIdle) {
        for (const a of this.agents) if (!a.parked && a.phase !== "park") this.park(a);
      }
      const allParked = this.agents.every((a) => a.parked);
      if ((allParked && this.clock - this.finishedAt > 400) || this.clock - this.finishedAt > 2600) {
        this.teardown();
        return;
      }
    }
    this.raf = requestAnimationFrame(this.tick);
  };

  /** Anything the visitor has already scrolled past appears instantly. */
  private scanScrolledPast() {
    for (const job of this.jobs) {
      if (job.state !== "pending") continue;
      if (job.el.getClientRects().length === 0) {
        this.revealInstant(job);
        continue;
      }
      const r = job.el.getBoundingClientRect();
      if (r.bottom < 0) this.revealInstant(job);
    }
  }

  private assign() {
    let active = 0;
    for (const a of this.agents) if (a.job) active++;
    const limit = Math.min(MAX_CONCURRENT, this.agents.length);

    while (active < limit && this.clock - this.lastAssign >= ASSIGN_GAP_MS) {
      // Reading order: lowest document index first.
      let job: Job | null = null;
      for (const j of this.jobs) {
        if (j.state === "pending" && j.eligible) {
          job = j;
          break;
        }
      }
      if (!job) return;

      const target = this.cursorRect(job.el);
      let best: Agent | null = null;
      let bestDist = Infinity;
      for (const a of this.agents) {
        if (a.job || (a.phase !== "idle" && a.phase !== "park")) continue;
        const d = Math.hypot(a.x - target.left, a.y - target.top);
        if (d < bestDist) {
          bestDist = d;
          best = a;
        }
      }
      if (!best) return;

      job.state = "active";
      best.job = job;
      best.parked = false;
      best.fromX = best.x;
      best.fromY = best.y;
      best.phase = "move";
      best.t0 = this.clock;
      best.dur = clamp(bestDist * 0.85, 380, 980);
      best.boxLabel.textContent = `${best.name} · <${job.el.tagName.toLowerCase()}> · ${job.mode}`;
      this.lastAssign = this.clock;
      active++;
    }
  }

  private updateAgent(a: Agent) {
    const p = a.dur > 0 ? clamp((this.clock - a.t0) / a.dur, 0, 1) : 1;
    const job = a.job;

    switch (a.phase) {
      case "move": {
        if (!job) break;
        const t = this.cursorRect(job.el);
        const e = easeInOutCubic(p);
        a.x = a.fromX + (t.left - a.fromX) * e;
        a.y = a.fromY + (t.top - a.fromY) * e;
        a.opacity = Math.min(1, a.opacity + 0.12);
        if (p >= 1) {
          a.phase = "draw";
          a.t0 = this.clock;
          a.dur = DRAW_MS;
          a.boxAlpha = 1;
        }
        break;
      }
      case "draw": {
        if (!job) break;
        const r = job.el.getBoundingClientRect();
        const e = easeOutCubic(p);
        this.placeBox(a, r.left, r.top, r.width * e, r.height * e);
        const c = this.clampPoint(r.left + r.width * e, r.top + r.height * e);
        a.x = c.x;
        a.y = c.y;
        a.opacity = 1;
        if (p >= 1) this.beginReveal(a, job);
        break;
      }
      case "reveal": {
        if (!job) break;
        const r = job.el.getBoundingClientRect();
        this.placeBox(a, r.left, r.top, r.width, r.height);
        if (job.mode === "type" && a.typing) {
          const run = a.typing;
          const target = Math.round(run.chars.length * p);
          for (let i = run.shown; i < target; i++) run.chars[i].classList.add("tc-on");
          if (target > run.shown) {
            run.chars[run.shown > 0 ? run.shown - 1 : 0]?.classList.remove("tc-caret");
            run.chars[target - 1]?.classList.add("tc-caret");
            run.shown = target;
          }
          const ch = run.chars[Math.max(0, run.shown - 1)];
          if (ch) {
            const cr = ch.getBoundingClientRect();
            const c = this.clampPoint(cr.right, cr.bottom - 2);
            a.x += (c.x - a.x) * 0.4;
            a.y += (c.y - a.y) * 0.4;
          }
        } else if (job.mode === "wipe") {
          const c = this.clampPoint(r.left + r.width * easeInOutCubic(p), r.top + r.height * 0.55);
          a.x = c.x;
          a.y = c.y;
        } else {
          const c = this.clampPoint(r.right, r.bottom);
          a.x += (c.x - a.x) * 0.3;
          a.y += (c.y - a.y) * 0.3;
        }
        if (p >= 1) this.completeReveal(a, job);
        break;
      }
      case "release": {
        a.boxAlpha = 1 - p;
        if (job) {
          const r = job.el.getBoundingClientRect();
          this.placeBox(a, r.left, r.top, r.width, r.height);
        }
        if (p >= 1) {
          a.job = null;
          a.boxAlpha = 0;
          a.phase = "idle";
          a.idleSince = this.clock;
        }
        break;
      }
      case "idle": {
        if (!a.parked && this.clock - a.idleSince > PARK_AFTER_MS) this.park(a);
        break;
      }
      case "park": {
        const e = easeInOutCubic(p);
        const vw = window.innerWidth;
        const tx = ((a.slot + 0.5) / this.agents.length) * vw;
        const ty = window.innerHeight + 48;
        a.x = a.fromX + (tx - a.fromX) * e;
        a.y = a.fromY + (ty - a.fromY) * e;
        a.opacity = 1 - e;
        if (p >= 1) {
          a.phase = "idle";
          a.parked = true;
          a.opacity = 0;
        }
        break;
      }
    }
  }

  private park(a: Agent) {
    a.phase = "park";
    a.fromX = a.x;
    a.fromY = a.y;
    a.t0 = this.clock;
    a.dur = 900;
  }

  private render(a: Agent) {
    a.root.style.transform = `translate3d(${a.x.toFixed(1)}px, ${a.y.toFixed(1)}px, 0)`;
    a.root.style.opacity = a.opacity.toFixed(3);
    a.root.classList.toggle("agent--flip", a.x > window.innerWidth - 150);
    a.box.style.opacity = a.boxAlpha.toFixed(3);
  }

  private placeBox(a: Agent, left: number, top: number, w: number, h: number) {
    a.box.style.transform = `translate3d(${left.toFixed(1)}px, ${top.toFixed(1)}px, 0)`;
    a.box.style.width = `${Math.max(0, w).toFixed(1)}px`;
    a.box.style.height = `${Math.max(0, h).toFixed(1)}px`;
    a.boxDims.textContent = `${Math.round(w)}×${Math.round(h)}`;
  }

  // ---------------------------------------------------------------- reveal

  private beginReveal(a: Agent, job: Job) {
    a.phase = "reveal";
    a.t0 = this.clock;
    const el = job.el;

    if (job.mode === "type") {
      const run = this.prepareType(el);
      el.setAttribute("data-built", "");
      if (run.chars.length === 0) {
        a.dur = 1;
        this.restoreType(run);
        return;
      }
      a.typing = run;
      a.dur = clamp(run.chars.length * 21, 260, 1250);
      return;
    }

    a.dur = job.mode === "wipe" ? WIPE_MS : POP_MS;
    el.setAttribute("data-anim", job.mode);
    el.setAttribute("data-built", "");
    const onEnd = () => this.clearAnim(el);
    this.animListeners.set(el, onEnd);
    el.addEventListener("animationend", onEnd, { once: true });
  }

  private completeReveal(a: Agent, job: Job) {
    if (a.typing) {
      this.restoreType(a.typing);
      a.typing = null;
    }
    if (job.state !== "done") {
      job.state = "done";
      this.built++;
      this.emitProgress();
    }
    a.phase = "release";
    a.t0 = this.clock;
    a.dur = RELEASE_MS;
  }

  private revealInstant(job: Job) {
    if (job.state === "done") return;
    job.el.setAttribute("data-built", "");
    job.state = "done";
    job.seen = true;
    this.built++;
    this.observer?.unobserve(job.el);
    this.emitProgress();
  }

  private clearAnim(el: HTMLElement) {
    el.removeAttribute("data-anim");
    const fn = this.animListeners.get(el);
    if (fn) {
      el.removeEventListener("animationend", fn);
      this.animListeners.delete(el);
    }
  }

  /** Split text nodes into per-character spans (layout is preserved; chars are just invisible). */
  private prepareType(el: HTMLElement): TypeRun {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    while (walker.nextNode()) {
      const n = walker.currentNode as Text;
      if (n.data.trim().length > 0) nodes.push(n);
    }
    const chars: HTMLSpanElement[] = [];
    const swaps: TypeRun["swaps"] = [];
    for (const orig of nodes) {
      const wrap = document.createElement("span");
      wrap.className = "tw";
      for (const ch of Array.from(orig.data)) {
        const s = document.createElement("span");
        s.className = "tc";
        s.textContent = ch;
        wrap.appendChild(s);
        chars.push(s);
      }
      orig.parentNode?.replaceChild(wrap, orig);
      swaps.push({ orig, wrap });
    }
    return { chars, swaps, shown: 0 };
  }

  /** Put the original Text nodes back so React's references stay valid. */
  private restoreType(run: TypeRun) {
    for (const { orig, wrap } of run.swaps) {
      wrap.parentNode?.replaceChild(orig, wrap);
    }
    run.swaps = [];
  }

  // ---------------------------------------------------------------- geometry

  private cursorRect(el: HTMLElement): Rect {
    const r = el.getBoundingClientRect();
    const p = this.clampPoint(r.left, r.top);
    return { left: p.x, top: p.y, width: r.width, height: r.height };
  }

  private clampPoint(x: number, y: number) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    return { x: clamp(x, 6, vw - 30), y: clamp(y, 6, vh - 30) };
  }

  private emitProgress() {
    this.opts.onProgress?.(this.built, this.jobs.length);
  }

  /**
   * The hero counts as built once everything of it that is ON SCREEN is built.
   * Hero elements below the fold (tall hero on phones, tablets, short laptop
   * windows) can only become eligible by scrolling — waiting for them too would
   * deadlock the tour, which itself waits for the hero. Those get built while
   * the tour scrolls. A hero job is "settled" when it is done, or when the
   * observer has reported it and it is outside the viewport.
   */
  private checkHero() {
    if (this.heroDone || this.heroJobs.length === 0) return;
    let anyDone = false;
    for (const j of this.heroJobs) {
      if (j.state === "done") {
        anyDone = true;
        continue;
      }
      if (j.state === "pending" && j.seen && !j.eligible) continue;
      return; // active, or on screen and still waiting for an agent
    }
    if (!anyDone) return;
    this.heroDone = true;
    dlog(
      "hero built (on-screen part)",
      this.heroJobs.map((j) => `${j.el.tagName.toLowerCase()}:${j.state === "done" ? "built" : "below-fold"}`).join(" "),
    );
    this.opts.onHeroBuilt?.();
  }
}
