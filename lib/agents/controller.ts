/**
 * Tiny external store shared by the engine (imperative) and the Dock (React).
 */

export type AgentState = {
  /** AgentLayer has mounted and decided what to do. */
  ready: boolean;
  /** Animation is enabled for this page load. */
  enabled: boolean;
  /** Boot loader is showing. */
  booting: boolean;
  paused: boolean;
  touring: boolean;
  /** Every [data-build] element is visible. */
  finished: boolean;
  built: number;
  total: number;
  agentCount: number;
};

type Listener = () => void;

const initial: AgentState = {
  ready: false,
  enabled: false,
  booting: false,
  paused: false,
  touring: false,
  finished: true,
  built: 0,
  total: 0,
  agentCount: 0,
};

let state: AgentState = initial;
const listeners = new Set<Listener>();

export const agentStore = {
  get: (): AgentState => state,
  getServer: (): AgentState => initial,
  set(patch: Partial<AgentState>) {
    let changed = false;
    for (const key of Object.keys(patch) as (keyof AgentState)[]) {
      if (state[key] !== patch[key]) {
        changed = true;
        break;
      }
    }
    if (!changed) return;
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

/** Actions are registered by AgentLayer once the engine exists. */
export type AgentActions = {
  togglePause: () => void;
  toggleAgents: () => void;
  startTour: () => void;
  stopTour: () => void;
};

const noop = () => {};
export const agentActions: AgentActions = {
  togglePause: noop,
  toggleAgents: noop,
  startTour: noop,
  stopTour: noop,
};

export function registerActions(actions: AgentActions) {
  Object.assign(agentActions, actions);
}
