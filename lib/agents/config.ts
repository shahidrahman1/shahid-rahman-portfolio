export const AGENTS = [
  { name: "Scout", color: "#22d3ee" },
  { name: "Layout", color: "#a3e635" },
  { name: "Typeset", color: "#facc15" },
  { name: "Motion", color: "#fb923c" },
  { name: "QA", color: "#f472b6" },
  { name: "Deploy", color: "#34d399" },
  { name: "Copy", color: "#60a5fa" },
  { name: "Lint", color: "#2dd4bf" },
  { name: "Index", color: "#e4e4e7" },
  { name: "Render", color: "#fdba74" },
  { name: "Palette", color: "#f9a8d4" },
  { name: "Review", color: "#bef264" },
] as const;

export const STORAGE_KEY = "pf-agents";
export const TOUR_KEY = "pf-tour";
/** ?autotour=on → agents forced on + the tour starts by itself once the hero is built. */
export const AUTOTOUR_PARAM = "autotour";
/** Hold at the top before scrolling and at the bottom after, for clean recordings. */
export const AUTOTOUR_HOLD_MS = 2000;
export const MAX_CONCURRENT = 6;

/** Bumped whenever the engine's flow changes. Check it in the console:
 *  document.documentElement.dataset.agentsEngine */
export const ENGINE_VERSION = "3-hero-onscreen";

/** ?agentsdebug=on logs every step of the build / tour flow to the console. */
export const DEBUG_PARAM = "agentsdebug";
let debugOn: boolean | null = null;
export function agentsDebug(): boolean {
  if (debugOn === null) {
    debugOn =
      typeof window !== "undefined" && new URLSearchParams(window.location.search).get(DEBUG_PARAM) === "on";
  }
  return debugOn;
}
export function dlog(...args: unknown[]) {
  if (agentsDebug()) console.info("%c[agents]", "color:#ff3b2f;font-weight:600", ...args);
}
export const BOOT_MS = 1150;

/** 6 cursors on phones, 9 on tablets / small laptops, all 12 on wide screens. */
export function agentCountForViewport(width: number): number {
  if (width < 768) return 6;
  if (width < 1280) return 9;
  return 12;
}

/**
 * Runs in <head> before first paint. Decides whether the build animation runs,
 * and if so adds `build-mode` so every [data-build] element starts hidden (no flash).
 * Priority: ?autotour=on  >  ?agents=on|off  >  saved toggle  >  prefers-reduced-motion (off) > on.
 * With ?autotour=on the page also starts at the very top (no scroll restoration).
 */
export const HEAD_SCRIPT = `(function(){try{var d=document.documentElement,u=new URLSearchParams(location.search),q=u.get('agents'),at=u.get('${AUTOTOUR_PARAM}')==='on',s=null,on;try{s=localStorage.getItem('${STORAGE_KEY}')}catch(e){}
if(at){on=true;d.setAttribute('data-autotour','on');history.scrollRestoration='manual';window.scrollTo(0,0)}else if(q==='on')on=true;else if(q==='off')on=false;else if(s==='off')on=false;else if(s==='on')on=true;else on=!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
d.setAttribute('data-agents',on?'on':'off');if(on)d.classList.add('build-mode');
try{if(sessionStorage.getItem('${TOUR_KEY}')){history.scrollRestoration='manual';window.scrollTo(0,0)}}catch(e){}}catch(e){}})();`;
