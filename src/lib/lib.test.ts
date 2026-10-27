import { schedule } from "../content";
import { fitWithin } from "./image";
import { fromMinutes, locate, toMinutes } from "./schedule";

describe("schedule", () => {
  it("finds the current item and how far into it we are", () => {
    const w = locate(schedule, toMinutes("12:30"));
    expect(w.phase).toBe("during");
    expect(w.current?.title).toBe("開席");
    expect(w.progress).toBeCloseTo(10 / 50);
    expect(w.next?.start).toBe("13:10");
  });

  it("knows before and after the day", () => {
    expect(locate(schedule, toMinutes("09:00")).phase).toBe("before");
    expect(locate(schedule, toMinutes("09:00")).next?.id).toBe("s1");
    expect(locate(schedule, toMinutes("15:00")).phase).toBe("after");
    expect(locate(schedule, toMinutes("15:00")).current).toBeNull();
  });

  it("an item's end minute belongs to the next item", () => {
    expect(locate(schedule, toMinutes("12:00")).current?.id).toBe("s2");
  });

  it("formats minutes", () => expect(fromMinutes(13 * 60 + 5)).toBe("13:05"));
});

describe("image sizing", () => {
  it("scales the long edge down and never up", () => {
    expect(fitWithin(4000, 3000, 1600)).toEqual({ width: 1600, height: 1200 });
    expect(fitWithin(3000, 4000, 1600)).toEqual({ width: 1200, height: 1600 });
    expect(fitWithin(800, 600, 1600)).toEqual({ width: 800, height: 600 });
  });
});
