import { useEffect, useState } from "react";
import type { Photo, PhotoSort } from "../api/types";
import { Icon } from "../components/Icon";
import { useActions } from "../components/Layout";
import { Lightbox, PhotoTile, useLike } from "../components/Photos";
import { useApp } from "../state/app";

const PAGE = 12;

export default function PhotoWall() {
  const { api, guest, version } = useApp();
  const { upload } = useActions();
  const like = useLike();
  const [sort, setSort] = useState<PhotoSort>("new");
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Photo[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<number | null>(null);

  // search waits for typing to pause
  useEffect(() => { const t = setTimeout(() => setQuery(q), 250); return () => clearTimeout(t); }, [q]);

  // first page on any change; keep as many as were already loaded when data changes underneath
  useEffect(() => {
    let live = true;
    setLoading(true);
    api.photos(guest?.id ?? null, { sort, q: query, offset: 0, limit: Math.max(PAGE, items.length) }).then((r) => {
      if (!live) return;
      setItems(r.items);
      setTotal(r.total);
      setLoading(false);
    });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, query, guest?.id, version]);

  const more = async () => {
    setLoading(true);
    const r = await api.photos(guest?.id ?? null, { sort, q: query, offset: items.length, limit: PAGE });
    setItems((cur) => [...cur, ...r.items]);
    setTotal(r.total);
    setLoading(false);
  };

  const photos = items.map(like.view);
  return <div className="page">
    <header className="page-head row between wrap">
      <div><h1>照片牆</h1><p className="muted">點兩下照片送愛心，愛心最多的照片有獎。</p></div>
      <button type="button" className="btn primary" onClick={upload}><Icon name="camera" size={18} />上傳</button>
    </header>

    <div className="toolbar">
      <label className="search">
        <Icon name="search" size={18} />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜尋照片名稱或拍攝者" aria-label="搜尋照片" />
      </label>
      <div className="seg" role="group" aria-label="排序">
        {(["new", "top"] as const).map((s) => <button key={s} type="button" aria-pressed={sort === s} onClick={() => setSort(s)}>{s === "new" ? "最新" : "最多愛心"}</button>)}
      </div>
    </div>

    <p className="muted small">{query ? `「${query}」找到 ${total} 張` : `共 ${total} 張`}</p>
    <div className="masonry wall">
      {photos.map((p, i) => <PhotoTile key={p.id} photo={p} onOpen={() => setOpen(i)} onLike={(m) => like.toggle(p, m)} rank={sort === "top" && !query && i < 3 ? i + 1 : undefined} />)}
    </div>
    {!loading && !photos.length && <p className="empty">{query ? "找不到符合的照片" : "還沒有照片，當第一個吧！"}</p>}
    {items.length < total && <div className="center"><button type="button" className="btn ghost" disabled={loading} onClick={more}>{loading ? "載入中…" : `再看 ${Math.min(PAGE, total - items.length)} 張`}</button></div>}

    <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} onLike={(p) => like.toggle(p)} />
  </div>;
}
