import { useState } from "react";
import type { Draw } from "../api/types";
import { Icon } from "../components/Icon";
import { Confirm } from "../components/Modal";
import { ago } from "../lib/format";
import { useApp, useData } from "../state/app";

// the couple's tools: moderate wishes and photos, run the prize draw
export default function Host() {
  const { api, changed, toast, version } = useApp();
  const wishes = useData(() => api.wishes(true));
  const photos = useData(() => api.photos(null, { sort: "new", limit: 200, includeHidden: true }), [version]);
  const draws = useData(() => api.draws());
  const [tab, setTab] = useState<"draw" | "wishes" | "photos">("draw");
  const [prize, setPrize] = useState("咖啡廳禮券");
  const [rolling, setRolling] = useState(false);
  const [winner, setWinner] = useState<Draw | null>(null);
  const [reset, setReset] = useState(false);

  const act = async (fn: () => Promise<unknown>, done: string) => {
    try { await fn(); changed(); toast(done); } catch (e) { toast((e as Error).message, "error"); }
  };
  const draw = async () => {
    setRolling(true);
    setWinner(null);
    const d = await api.draw(prize);
    setRolling(false);
    if (!d) return toast("沒有可以抽的人了：每個上傳過照片的人都抽過了", "error");
    setWinner(d);
    changed();
  };

  return <div className="page">
    <header className="page-head"><h1>新人管理</h1><p className="muted">抽獎、挑精選祝福、隱藏不適合的內容。展示版不需要密碼。</p></header>
    <div className="seg big" role="tablist">
      {([["draw", "抽獎"], ["wishes", "祝福"], ["photos", "照片"]] as const).map(([k, l]) =>
        <button key={k} type="button" role="tab" aria-selected={tab === k} aria-pressed={tab === k} onClick={() => setTab(k)}>{l}</button>)}
    </div>

    {tab === "draw" && <section className="section">
      <div className="panel-card draw-card">
        <p className="muted small">上傳過照片的賓客每人一張籤，抽過的人不會再中。</p>
        <label className="field"><span>獎品</span><input value={prize} onChange={(e) => setPrize(e.target.value)} maxLength={20} /></label>
        <button type="button" className="btn primary" disabled={rolling} onClick={draw}><Icon name="gift" size={18} />{rolling ? "抽獎中…" : "抽一位"}</button>
        <div className={`draw-result ${rolling ? "rolling" : ""}`} aria-live="assertive">
          {rolling ? <span className="dots">🎲</span> : winner ? <><span className="eyebrow">恭喜</span><b>{winner.guestName}</b><span>獲得 {winner.prize}</span></> : <span className="muted">按下去就開抽</span>}
        </div>
      </div>
      {!!draws.data?.length && <ul className="draws">{draws.data.map((d) => <li key={d.id}><Icon name="gift" size={18} /><b>{d.guestName}</b><span>{d.prize}</span><small className="muted">{ago(d.at)}</small></li>)}</ul>}
    </section>}

    {tab === "wishes" && <ul className="mod-list">
      {wishes.data?.map((w) => <li key={w.id} className={w.hidden ? "is-hidden" : ""}>
        <div><p>{w.text}</p><span className="muted small">{w.guestName}・{ago(w.updatedAt)}</span></div>
        <button type="button" className={`icon-btn ${w.featured ? "on" : ""}`} disabled={w.hidden} aria-pressed={w.featured} aria-label={w.featured ? "取消精選" : "設為精選"}
          onClick={() => act(() => api.setWishFeatured(w.id, !w.featured), w.featured ? "已取消精選" : "已設為精選")}><Icon name="star" filled={w.featured} /></button>
        <button type="button" className="icon-btn" aria-label={w.hidden ? "重新顯示" : "隱藏"}
          onClick={() => act(() => api.setWishHidden(w.id, !w.hidden), w.hidden ? "已重新顯示" : "已隱藏")}><Icon name={w.hidden ? "eye-off" : "eye"} /></button>
      </li>)}
    </ul>}

    {tab === "photos" && <ul className="mod-grid">
      {photos.data?.items.map((p) => <li key={p.id} className={p.hidden ? "is-hidden" : ""}>
        <img src={p.src} alt={p.title} loading="lazy" />
        <div className="mod-bar"><span>{p.guestName}・♥ {p.likes}</span>
          <button type="button" className="icon-btn on-image" aria-label={p.hidden ? "重新顯示" : "隱藏"}
            onClick={() => act(() => api.setPhotoHidden(p.id, !p.hidden), p.hidden ? "已重新顯示" : "已隱藏")}><Icon name={p.hidden ? "eye-off" : "eye"} size={18} /></button>
        </div>
      </li>)}
    </ul>}

    <section className="section danger-zone">
      <h2>展示資料</h2>
      <p className="muted small">把照片、愛心、祝福、抽獎還原成一開始的樣子。</p>
      <button type="button" className="btn ghost" onClick={() => setReset(true)}>重設展示資料</button>
    </section>
    <Confirm open={reset} title="重設展示資料？" text="你上傳的照片、按的愛心和寫的祝福都會清掉。" confirm="重設" danger onCancel={() => setReset(false)}
      onConfirm={() => { setReset(false); act(() => api.reset(), "已重設"); }} />
  </div>;
}
