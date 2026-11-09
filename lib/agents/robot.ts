/** Tiny robot head used inside each cursor's name tag. Animated purely with CSS. */
export function robotSvg(delay: number): string {
  const d = delay.toFixed(2);
  return `<svg class="robot" width="14" height="15" viewBox="0 0 14 15" aria-hidden="true">
  <line x1="7" y1="3.6" x2="7" y2="1.9" class="robot-stalk"/>
  <circle cx="7" cy="1.7" r="1.35" class="robot-antenna" style="animation-delay:${d}s"/>
  <rect x="0.6" y="7.3" width="1.4" height="3" rx="0.5" class="robot-ear"/>
  <rect x="12" y="7.3" width="1.4" height="3" rx="0.5" class="robot-ear"/>
  <rect x="1.8" y="4" width="10.4" height="9.6" rx="2.8" class="robot-head"/>
  <g class="robot-eyes" style="animation-delay:${(delay * 1.7).toFixed(2)}s">
    <circle cx="5" cy="8.4" r="1.25" class="robot-eye"/>
    <circle cx="9" cy="8.4" r="1.25" class="robot-eye"/>
  </g>
  <rect x="5" y="11" width="4" height="0.9" rx="0.45" class="robot-mouth"/>
</svg>`;
}

export const ARROW_SVG = `<svg class="agent-arrow" width="22" height="24" viewBox="0 0 22 24" aria-hidden="true"><path d="M2.4 2.2 L2.4 19.8 L7.2 15.5 L10.4 22.4 L13.7 20.9 L10.6 14.1 L17 14.1 Z"/></svg>`;
