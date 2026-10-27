import type { ScheduleItem } from "../content";

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
export const fromMinutes = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(Math.floor(m % 60)).padStart(2, "0")}`;

export type Phase = "before" | "during" | "after";

// where the day stands at a given minute: the current item, the next one, and how far into the current one
export function locate(items: ScheduleItem[], minute: number) {
  const first = toMinutes(items[0].start), last = toMinutes(items[items.length - 1].end);
  const phase: Phase = minute < first ? "before" : minute >= last ? "after" : "during";
  const index = items.findIndex((it) => minute >= toMinutes(it.start) && minute < toMinutes(it.end));
  const current = index >= 0 ? items[index] : null;
  const next = items.find((it) => toMinutes(it.start) > minute) ?? null;
  const progress = current ? (minute - toMinutes(current.start)) / (toMinutes(current.end) - toMinutes(current.start)) : 0;
  return { phase, current, index, next, progress, minutesToNext: next ? toMinutes(next.start) - minute : null };
}

export const range = (items: ScheduleItem[]) => ({ from: toMinutes(items[0].start) - 30, to: toMinutes(items[items.length - 1].end) + 30 });
