import { createDemoApi, seed } from "./demo";

const fresh = (random = () => 0) => createDemoApi({ persist: false, initial: seed(1_000_000_000_000), random });

describe("demo backend", () => {
  it("joining with the same name returns the same guest", async () => {
    const api = fresh();
    const a = await api.join("  小美 ");
    const b = await api.join("小美");
    expect(a.id).toBe(b.id);
    await expect(api.join("   ")).rejects.toThrow("名字不能空白");
  });

  it("likes toggle and count once per guest", async () => {
    const api = fresh(), g = await api.join("新來的");
    const [p] = (await api.photos(g.id, { sort: "new", limit: 1 })).items;
    const on = await api.toggleLike(g.id, p.id);
    expect(on).toEqual({ liked: true, likes: p.likes + 1 });
    const off = await api.toggleLike(g.id, p.id);
    expect(off).toEqual({ liked: false, likes: p.likes });
  });

  it("sorts by likes and searches title or uploader", async () => {
    const api = fresh();
    const top = (await api.photos(null, { sort: "top" })).items.map((p) => p.likes);
    expect(top).toEqual([...top].sort((a, b) => b - a));
    const byName = await api.photos(null, { sort: "new", q: "emily" });
    expect(byName.items.every((p) => p.guestName === "Emily")).toBe(true);
    expect(byName.total).toBe(2);
  });

  it("only the uploader can delete a photo", async () => {
    const api = fresh(), me = await api.join("我"), other = await api.join("別人");
    const [mine] = await api.upload(me.id, [{ title: "測試", src: "data:x", width: 10, height: 10 }]);
    await expect(api.deletePhoto(other.id, mine.id)).rejects.toThrow("只能刪除自己的照片");
    await api.deletePhoto(me.id, mine.id);
    expect(await api.myPhotos(me.id)).toEqual([]);
  });

  it("one wish per guest, edited in place; hidden wishes leave the wall", async () => {
    const api = fresh(), g = await api.join("阿明");
    const w1 = await api.saveWish(g.id, "第一版");
    const w2 = await api.saveWish(g.id, "第二版");
    expect(w2.id).toBe(w1.id);
    expect((await api.wishes()).filter((w) => w.guestId === g.id)).toHaveLength(1);
    await api.setWishHidden(w1.id, true);
    expect((await api.wishes()).some((w) => w.id === w1.id)).toBe(false);
    expect((await api.wishes(true)).some((w) => w.id === w1.id)).toBe(true);
  });

  it("the draw only picks uploaders and never the same person twice", async () => {
    const api = fresh(() => 0.999);
    const uploaders = new Set((await api.photos(null, { sort: "new", limit: 99 })).items.map((p) => p.guestId));
    const winners: string[] = [];
    for (let i = 0; i < uploaders.size; i++) winners.push((await api.draw("禮物"))!.guestId);
    expect(new Set(winners).size).toBe(uploaders.size);
    expect(winners.every((w) => uploaders.has(w))).toBe(true);
    expect(await api.draw("再一次")).toBeNull();
  });

  it("photographers are ranked by likes on visible photos", async () => {
    const api = fresh();
    const people = await api.photographers();
    expect(people.map((p) => p.likes)).toEqual([...people.map((p) => p.likes)].sort((a, b) => b - a));
    const top = people[0];
    const theirs = (await api.photos(null, { sort: "new", limit: 99 })).items.filter((p) => p.guestId === top.guestId);
    for (const p of theirs) await api.setPhotoHidden(p.id, true);
    expect((await api.photographers()).some((p) => p.guestId === top.guestId)).toBe(false);
  });
});
