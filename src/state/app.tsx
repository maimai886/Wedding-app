// App-wide state: the backend, who is using it, the wedding-day clock, and toasts.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createDemoApi } from "../api/demo";
import type { Guest, WeddingApi } from "../api/types";
import { schedule } from "../content";
import { range, toMinutes } from "../lib/schedule";

const api = createDemoApi();

interface Toast { id: number; text: string; kind: "ok" | "error" }
interface Clock { minute: number; live: boolean; setMinute: (m: number) => void; goLive: () => void }
interface AppState {
  api: WeddingApi;
  guest: Guest | null;
  join: (name: string) => Promise<Guest>;
  leave: () => void;
  askName: boolean;
  setAskName: (v: boolean) => void;
  version: number; // bumps after any write so lists refetch
  changed: () => void;
  toast: (text: string, kind?: Toast["kind"]) => void;
  clock: Clock;
}

const Ctx = createContext<AppState | null>(null);
export const useApp = () => useContext(Ctx)!;

const GUEST_KEY = "wedding-guest";
const nowMinute = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60; };

export function AppProvider({ children }: { children: ReactNode }) {
  const [guest, setGuest] = useState<Guest | null>(() => {
    try { return JSON.parse(localStorage.getItem(GUEST_KEY) ?? "null"); } catch { return null; }
  });
  const [askName, setAskName] = useState(() => guest === null);
  const [version, setVersion] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextToast = useRef(0);

  const toast = useCallback((text: string, kind: Toast["kind"] = "ok") => {
    const id = ++nextToast.current;
    setToasts((t) => [...t, { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const join = useCallback(async (name: string) => {
    const g = await api.join(name);
    setGuest(g);
    try { localStorage.setItem(GUEST_KEY, JSON.stringify(g)); } catch { /* private mode: forgotten on reload */ }
    return g;
  }, []);
  const leave = useCallback(() => {
    setGuest(null);
    try { localStorage.removeItem(GUEST_KEY); } catch { /* nothing stored */ }
    setAskName(true);
  }, []);

  // Live clock on the wedding day; any other time the demo pretends it is mid-reception so the schedule has
  // something to show, and the slider on the schedule page can move it.
  const { from, to } = range(schedule);
  const inDay = (m: number) => m >= from && m <= to;
  const [sim, setSim] = useState<number | null>(() => (inDay(nowMinute()) ? null : toMinutes("12:40")));
  const [tick, setTick] = useState(nowMinute);
  useEffect(() => {
    const t = setInterval(() => setTick(nowMinute()), 15_000);
    return () => clearInterval(t);
  }, []);
  const clock: Clock = {
    minute: sim ?? tick,
    live: sim === null,
    setMinute: setSim,
    goLive: () => setSim(inDay(nowMinute()) ? null : toMinutes("12:40")),
  };

  const value = useMemo<AppState>(() => ({
    api, guest, join, leave, askName, setAskName, version, changed: () => setVersion((v) => v + 1), toast, clock,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [guest, askName, version, sim, tick]);

  return <Ctx.Provider value={value}>
    {children}
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => <div key={t.id} className={`toast ${t.kind}`}>{t.text}</div>)}
    </div>
  </Ctx.Provider>;
}

// fetch on mount and whenever data changes anywhere in the app
export function useData<T>(load: () => Promise<T>, deps: unknown[] = []) {
  const { version } = useApp();
  const [state, setState] = useState<{ data: T | null; loading: boolean; error: string | null }>({ data: null, loading: true, error: null });
  useEffect(() => {
    let live = true;
    setState((s) => ({ ...s, loading: true }));
    load().then(
      (data) => live && setState({ data, loading: false, error: null }),
      (e: Error) => live && setState((s) => ({ ...s, loading: false, error: e.message })),
    );
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, ...deps]);
  return state;
}

// the name prompt guards actions that need one
export function useRequireGuest() {
  const { guest, setAskName, toast } = useApp();
  return (): Guest | null => {
    if (guest) return guest;
    toast("先告訴我們你的名字吧", "error");
    setAskName(true);
    return null;
  };
}
