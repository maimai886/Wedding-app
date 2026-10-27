// Photo tiles with double-tap-to-like, and a full-screen viewer.
import { useEffect, useRef, useState } from "react";
import type { Photo } from "../api/types";
import { ago } from "../lib/format";
import { useApp, useRequireGuest } from "../state/app";
import { Icon } from "./Icon";
import { showKeepingScroll } from "./Modal";

// likes are shown immediately and rolled back if the server says no
export function useLike() {
  const { api, toast, changed } = useApp();
  const need = useRequireGuest();
  const [over, setOver] = useState<Record<string, { likedByMe: boolean; likes: number }>>({});
  const view = (p: Photo): Photo => ({ ...p, ...over[p.id] });
  // double-tap only ever likes; the heart button toggles
  const toggle = async (p: Photo, mode: "like" | "toggle" = "toggle") => {
    const g = need();
    if (!g) return;
    const cur = view(p);
    if (mode === "like" && cur.likedByMe) return;
    const likedByMe = !cur.likedByMe;
    setOver((o) => ({ ...o, [p.id]: { likedByMe, likes: cur.likes + (likedByMe ? 1 : -1) } }));
    try {
      const r = await api.toggleLike(g.id, p.id);
      setOver((o) => ({ ...o, [p.id]: { likedByMe: r.liked, likes: r.likes } }));
      changed();
    } catch (e) {
      setOver((o) => { const { [p.id]: _drop, ...rest } = o; return rest; });
      toast((e as Error).message, "error");
    }
  };
  return { view, toggle };
}

export function PhotoTile({ photo, onOpen, onLike, rank }: { photo: Photo; onOpen: () => void; onLike: (mode: "like" | "toggle") => void; rank?: number }) {
  const [burst, setBurst] = useState(0);
  const lastTap = useRef(0);
  const tap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) { onLike("like"); setBurst((b) => b + 1); lastTap.current = 0; }
    else {
      lastTap.current = now;
      setTimeout(() => { if (lastTap.current === now) onOpen(); }, 300);
    }
  };
  return <figure className="tile" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
    <button type="button" className="tile-img" onClick={tap} aria-label={`看大圖：${photo.title}`}>
      <img src={photo.src} alt={photo.title} loading="lazy" />
      {burst > 0 && <span key={burst} className="burst" aria-hidden="true"><Icon name="heart" size={72} filled /></span>}
    </button>
    {rank !== undefined && <span className={`rank r${rank}`}>{rank}</span>}
    {photo.hidden && <span className="badge-hidden">已隱藏</span>}
    <figcaption>
      <div className="tile-text"><b>{photo.title}</b><span>{photo.guestName}・{ago(photo.createdAt)}</span></div>
      <button type="button" className={`like ${photo.likedByMe ? "on" : ""}`} aria-pressed={photo.likedByMe}
        aria-label={`${photo.likedByMe ? "取消喜歡" : "喜歡"}，目前 ${photo.likes} 個愛心`} onClick={() => onLike("toggle")}>
        <Icon name="heart" size={18} filled={photo.likedByMe} />{photo.likes}
      </button>
    </figcaption>
  </figure>;
}

export function Lightbox({ photos, index, onIndex, onClose, onLike }: {
  photos: Photo[]; index: number | null; onIndex: (i: number) => void; onClose: () => void; onLike: (p: Photo) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const touch = useRef<number | null>(null);
  const open = index !== null && photos[index] !== undefined;
  useEffect(() => {
    const d = ref.current!;
    if (open && !d.open) showKeepingScroll(d);
    if (!open && d.open) d.close();
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onIndex((index! + 1) % photos.length);
      if (e.key === "ArrowLeft") onIndex((index! - 1 + photos.length) % photos.length);
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [open, index, photos.length, onIndex]);
  const p = open ? photos[index!] : null;
  const step = (d: number) => onIndex((index! + d + photos.length) % photos.length);
  return <dialog ref={ref} className="lightbox" onClose={onClose} aria-label="照片"
    onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
    onTouchEnd={(e) => { if (touch.current === null) return; const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); touch.current = null; }}>
    {p && <>
      <button type="button" className="icon-btn lb-close" onClick={onClose} aria-label="關閉"><Icon name="x" /></button>
      {photos.length > 1 && <>
        <button type="button" className="icon-btn lb-nav prev" onClick={() => step(-1)} aria-label="上一張"><Icon name="chevron-left" size={28} /></button>
        <button type="button" className="icon-btn lb-nav next" onClick={() => step(1)} aria-label="下一張"><Icon name="chevron-right" size={28} /></button>
      </>}
      <img src={p.src} alt={p.title} />
      <div className="lb-bar">
        <div><b>{p.title}</b><span>{p.guestName}・{ago(p.createdAt)}・{index! + 1} / {photos.length}</span></div>
        <button type="button" className={`like big ${p.likedByMe ? "on" : ""}`} aria-pressed={p.likedByMe} onClick={() => onLike(p)}>
          <Icon name="heart" size={22} filled={p.likedByMe} />{p.likes}
        </button>
      </div>
    </>}
  </dialog>;
}
