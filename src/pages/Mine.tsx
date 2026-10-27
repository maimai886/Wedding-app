import { useState } from "react";
import { Link } from "react-router";
import type { Photo } from "../api/types";
import { Icon } from "../components/Icon";
import { useActions } from "../components/Layout";
import { Confirm } from "../components/Modal";
import { wedding } from "../content";
import { ago } from "../lib/format";
import { useApp, useData } from "../state/app";

// my uploads, a framed preview of them on a table, delete
export default function Mine() {
  const { api, guest, changed, toast, setAskName } = useApp();
  const { upload, wish } = useActions();
  const list = useData(() => (guest ? api.myPhotos(guest.id) : Promise.resolve([])), [guest?.id]);
  const myWish = useData(() => (guest ? api.myWish(guest.id) : Promise.resolve(null)), [guest?.id]);
  const [framed, setFramed] = useState(0);
  const [del, setDel] = useState<Photo | null>(null);

  if (!guest) return <div className="page"><div className="empty-state">
    <Icon name="user" size={40} />
    <h1>還不知道你是誰</h1>
    <p className="muted">輸入名字後，這裡會放你上傳的照片和祝福。</p>
    <button type="button" className="btn primary" onClick={() => setAskName(true)}>輸入名字</button>
  </div></div>;

  const photos = list.data ?? [];
  const current = photos[Math.min(framed, photos.length - 1)];
  const likes = photos.reduce((s, p) => s + p.likes, 0);
  const remove = async () => {
    if (!del) return;
    try { await api.deletePhoto(guest.id, del.id); toast("照片已刪除"); changed(); setFramed(0); }
    catch (e) { toast((e as Error).message, "error"); }
    setDel(null);
  };

  return <div className="page">
    <header className="page-head row between wrap">
      <div><h1>{guest.name} 的照片</h1><p className="muted">{photos.length} 張・{likes} 個愛心{photos.length ? "・已有抽獎資格" : ""}</p></div>
      <div className="row"><Link to="/ranking" className="btn ghost"><Icon name="trophy" size={18} />排行榜</Link><button type="button" className="btn primary" onClick={upload}><Icon name="camera" size={18} />上傳</button></div>
    </header>

    {current ? <section className="frame-stage" style={{ backgroundImage: `url(${wedding.frameTable})` }} aria-label="相框預覽">
      <button type="button" className="icon-btn stage-nav prev" disabled={photos.length < 2} onClick={() => setFramed((framed - 1 + photos.length) % photos.length)} aria-label="上一張"><Icon name="chevron-left" size={26} /></button>
      <figure key={current.id} className="polaroid">
        <img src={current.src} alt={current.title} />
        <figcaption>{current.title}<small>{wedding.couple.groom} & {wedding.couple.bride}・{wedding.date}</small></figcaption>
      </figure>
      <button type="button" className="icon-btn stage-nav next" disabled={photos.length < 2} onClick={() => setFramed((framed + 1) % photos.length)} aria-label="下一張"><Icon name="chevron-right" size={26} /></button>
      <span className="stage-label"><Icon name="frame" size={14} />相框預覽 {Math.min(framed, photos.length - 1) + 1} / {photos.length}</span>
    </section> : list.data && <div className="empty-state">
      <Icon name="camera" size={40} />
      <h2>還沒有上傳照片</h2>
      <p className="muted">上傳一張就能參加抽獎，照片也會出現在照片牆。</p>
      <button type="button" className="btn primary" onClick={upload}>上傳第一張</button>
    </div>}

    {!!photos.length && <section className="section">
      <h2>全部照片</h2>
      <ul className="mine-list">
        {photos.map((p, i) => <li key={p.id} className={i === framed ? "active" : ""}>
          <button type="button" className="thumb" onClick={() => setFramed(i)} aria-label={`放進相框：${p.title}`}><img src={p.src} alt="" /></button>
          <div className="mine-text"><b>{p.title}</b><span className="muted small">{ago(p.createdAt)}・<Icon name="heart" size={12} filled /> {p.likes}{p.hidden && "・新人已隱藏"}</span></div>
          <button type="button" className="icon-btn" onClick={() => setDel(p)} aria-label={`刪除 ${p.title}`}><Icon name="trash" size={18} /></button>
        </li>)}
      </ul>
    </section>}

    <section className="section">
      <h2>我的祝福</h2>
      {myWish.data ? <blockquote className="wish mine"><p>{myWish.data.text}</p><cite>{ago(myWish.data.updatedAt)}</cite></blockquote> : <p className="muted">還沒寫祝福。</p>}
      <button type="button" className="btn ghost" onClick={wish}><Icon name="pen" size={18} />{myWish.data ? "修改" : "寫祝福"}</button>
    </section>

    <Confirm open={!!del} title="刪除照片？" text={`「${del?.title}」會從照片牆移除，愛心也會一起消失。`} confirm="刪除" danger onCancel={() => setDel(null)} onConfirm={remove} />
  </div>;
}
