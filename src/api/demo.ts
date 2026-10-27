// The whole backend, in the browser: seeded with made-up guests and AI-generated photos, persisted to
// IndexedDB so uploads, likes and wishes survive a reload.
import { kv } from "./store";
import {
  ApiError, type Draw, type Guest, type NewPhoto, type Page, type Photo, type PhotoQuery, type Photographer,
  type Stats, type WeddingApi, type Wish,
} from "./types";

interface PhotoRow extends Omit<Photo, "likes" | "likedByMe" | "guestName"> { likedBy: string[] }
interface WishRow extends Omit<Wish, "guestName"> {}
export interface Db { guests: Guest[]; photos: PhotoRow[]; wishes: WishRow[]; draws: Draw[] }

const KEY = "db-v1";
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const demo = (f: string) => `${import.meta.env.BASE_URL}demo/${f}`;

export function seed(now = Date.now()): Db {
  const min = 60_000;
  const guests: Guest[] = ["小美", "阿傑", "Emily", "大雄", "佳佳", "Ken"].map((name, i) => ({ id: `g${i + 1}`, name, joinedAt: now - (90 - i * 9) * min }));
  const ids = guests.map((g) => g.id);
  const likers = (n: number, skip: string) => ids.filter((g) => g !== skip).slice(0, n);
  const p = (id: string, guestId: string, title: string, file: string, width: number, height: number, ago: number, likes: number): PhotoRow =>
    ({ id, guestId, title, src: demo(file), width, height, createdAt: now - ago * min, likedBy: likers(likes, guestId), hidden: false });
  return {
    guests,
    photos: [
      p("p1", "g1", "新人入場前的庭園", "garden.jpg", 1280, 853, 80, 4),
      p("p2", "g2", "三層蛋糕好美", "cake.jpg", 1280, 1280, 62, 5),
      p("p3", "g3", "Cheers!", "toast.jpg", 1280, 853, 55, 3),
      p("p4", "g1", "捧花特寫", "bouquet.jpg", 853, 1280, 48, 5),
      p("p5", "g4", "我們這桌", "table.jpg", 1280, 853, 40, 1),
      p("p6", "g5", "戒指", "rings.jpg", 1280, 1280, 33, 4),
      p("p7", "g6", "抽獎時間", "raffle.jpg", 1280, 1280, 20, 2),
      p("p8", "g3", "仙女棒送客", "sparklers.jpg", 853, 1280, 8, 5),
    ],
    wishes: [
      ["g1", "從大學社團一路看你們走到今天，新婚快樂！記得蜜月照片要分享 🤍", 75, true],
      ["g2", "恭喜！以後吵架記得先吃飽再說，百年好合～", 66, false],
      ["g3", "Congratulations! Wishing you a lifetime of love and laughter.", 58, false],
      ["g4", "祝早生貴子！我已經準備好當乾爹了", 44, false],
      ["g5", "今天的庭園跟你們都好美，要一直這麼幸福喔", 30, false],
    ].map(([guestId, text, ago, featured], i) => ({
      id: `w${i + 1}`, guestId: guestId as string, text: text as string, createdAt: now - (ago as number) * min, updatedAt: now - (ago as number) * min,
      hidden: false, featured: featured as boolean,
    })),
    draws: [],
  };
}

export function createDemoApi(opts: { random?: () => number; persist?: boolean; initial?: Db } = {}): WeddingApi {
  const random = opts.random ?? Math.random, persist = opts.persist ?? true;
  let db: Db | null = opts.initial ?? null;

  const load = async (): Promise<Db> => {
    if (db) return db;
    db = (persist ? await kv.get<Db>(KEY).catch(() => undefined) : undefined) ?? seed();
    return db;
  };
  const save = async () => { if (persist && db) await kv.set(KEY, db).catch(() => undefined); };
  const nameOf = (d: Db, id: string) => d.guests.find((g) => g.id === id)?.name ?? "賓客";
  const guestOrThrow = (d: Db, id: string) => {
    if (!d.guests.some((g) => g.id === id)) throw new ApiError("請先輸入名字");
  };
  const view = (d: Db, r: PhotoRow, viewer: string | null): Photo => {
    const { likedBy, ...rest } = r;
    return { ...rest, guestName: nameOf(d, r.guestId), likes: likedBy.length, likedByMe: viewer ? likedBy.includes(viewer) : false };
  };
  const wishView = (d: Db, w: WishRow): Wish => ({ ...w, guestName: nameOf(d, w.guestId) });
  // a short pause makes loading states visible, like a real network
  const lag = <T,>(v: T, ms = 120) => new Promise<T>((r) => setTimeout(() => r(v), persist ? ms : 0));

  return {
    async join(name) {
      const d = await load(), clean = name.trim().slice(0, 12);
      if (!clean) throw new ApiError("名字不能空白");
      let g = d.guests.find((x) => x.name === clean);
      if (!g) { g = { id: uid(), name: clean, joinedAt: Date.now() }; d.guests.push(g); await save(); }
      return lag(g);
    },

    async stats(): Promise<Stats> {
      const d = await load(), photos = d.photos.filter((p) => !p.hidden);
      return lag({ guests: d.guests.length, photos: photos.length, wishes: d.wishes.filter((w) => !w.hidden).length, likes: photos.reduce((s, p) => s + p.likedBy.length, 0) }, 60);
    },

    async photos(viewer, { sort, q, offset = 0, limit = 24, includeHidden }: PhotoQuery): Promise<Page<Photo>> {
      const d = await load(), needle = q?.trim().toLowerCase();
      let rows = d.photos.filter((p) => includeHidden || !p.hidden);
      if (needle) rows = rows.filter((p) => p.title.toLowerCase().includes(needle) || nameOf(d, p.guestId).toLowerCase().includes(needle));
      rows = [...rows].sort(sort === "top" ? (a, b) => b.likedBy.length - a.likedBy.length || b.createdAt - a.createdAt : (a, b) => b.createdAt - a.createdAt);
      return lag({ items: rows.slice(offset, offset + limit).map((r) => view(d, r, viewer)), total: rows.length });
    },

    async myPhotos(guestId) {
      const d = await load();
      return lag(d.photos.filter((p) => p.guestId === guestId).sort((a, b) => b.createdAt - a.createdAt).map((r) => view(d, r, guestId)));
    },

    async upload(guestId, photos: NewPhoto[]) {
      const d = await load();
      guestOrThrow(d, guestId);
      if (!photos.length) throw new ApiError("沒有選擇照片");
      const now = Date.now();
      const rows = photos.map((p, i): PhotoRow => ({
        id: uid(), guestId, title: p.title.trim().slice(0, 20) || "未命名", src: p.src, width: p.width, height: p.height,
        createdAt: now + i, likedBy: [], hidden: false,
      }));
      d.photos.push(...rows);
      await save();
      return lag(rows.map((r) => view(d, r, guestId)), 300);
    },

    async deletePhoto(guestId, photoId) {
      const d = await load(), p = d.photos.find((x) => x.id === photoId);
      if (!p) throw new ApiError("照片不存在");
      if (p.guestId !== guestId) throw new ApiError("只能刪除自己的照片");
      d.photos = d.photos.filter((x) => x.id !== photoId);
      await save();
      return lag(undefined);
    },

    async toggleLike(guestId, photoId) {
      const d = await load(), p = d.photos.find((x) => x.id === photoId);
      guestOrThrow(d, guestId);
      if (!p) throw new ApiError("照片不存在");
      const liked = !p.likedBy.includes(guestId);
      p.likedBy = liked ? [...p.likedBy, guestId] : p.likedBy.filter((x) => x !== guestId);
      await save();
      return lag({ liked, likes: p.likedBy.length }, 40);
    },

    async wishes(includeHidden) {
      const d = await load();
      return lag(d.wishes.filter((w) => includeHidden || !w.hidden)
        .sort((a, b) => Number(b.featured) - Number(a.featured) || b.updatedAt - a.updatedAt).map((w) => wishView(d, w)));
    },

    async myWish(guestId) {
      const d = await load(), w = d.wishes.find((x) => x.guestId === guestId);
      return lag(w ? wishView(d, w) : null, 60);
    },

    async saveWish(guestId, text) {
      const d = await load(), clean = text.trim().slice(0, 120);
      guestOrThrow(d, guestId);
      if (!clean) throw new ApiError("祝福不能空白");
      const now = Date.now();
      let w = d.wishes.find((x) => x.guestId === guestId);
      if (w) Object.assign(w, { text: clean, updatedAt: now });
      else { w = { id: uid(), guestId, text: clean, createdAt: now, updatedAt: now, hidden: false, featured: false }; d.wishes.push(w); }
      await save();
      return lag(wishView(d, w));
    },

    async photographers(): Promise<Photographer[]> {
      const d = await load(), by = new Map<string, Photographer>();
      for (const p of d.photos.filter((x) => !x.hidden)) {
        const r = by.get(p.guestId) ?? { guestId: p.guestId, guestName: nameOf(d, p.guestId), photos: 0, likes: 0 };
        r.photos++;
        r.likes += p.likedBy.length;
        by.set(p.guestId, r);
      }
      return lag([...by.values()].sort((a, b) => b.likes - a.likes || b.photos - a.photos));
    },

    async setPhotoHidden(photoId, hidden) {
      const d = await load(), p = d.photos.find((x) => x.id === photoId);
      if (p) { p.hidden = hidden; await save(); }
    },
    async setWishHidden(wishId, hidden) {
      const d = await load(), w = d.wishes.find((x) => x.id === wishId);
      if (w) { w.hidden = hidden; if (hidden) w.featured = false; await save(); }
    },
    async setWishFeatured(wishId, featured) {
      const d = await load(), w = d.wishes.find((x) => x.id === wishId);
      if (w) { w.featured = featured; await save(); }
    },

    // everyone who uploaded a visible photo gets one ticket; nobody wins twice
    async draw(prize) {
      const d = await load(), won = new Set(d.draws.map((x) => x.guestId));
      const pool = [...new Set(d.photos.filter((p) => !p.hidden).map((p) => p.guestId))].filter((g) => !won.has(g));
      if (!pool.length) return lag(null);
      const guestId = pool[Math.floor(random() * pool.length)];
      const draw: Draw = { id: uid(), prize: prize.trim() || "神秘小禮物", guestId, guestName: nameOf(d, guestId), at: Date.now() };
      d.draws.unshift(draw);
      await save();
      return lag(draw, 900);
    },
    async draws() { return lag((await load()).draws); },

    async reset() {
      db = seed();
      await save();
    },
  };
}
