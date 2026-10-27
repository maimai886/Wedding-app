import { useState } from "react";
import { Link } from "react-router";
import { Icon } from "../components/Icon";
import { NowCard, useActions } from "../components/Layout";
import { Lightbox, PhotoTile, useLike } from "../components/Photos";
import { wedding } from "../content";
import { useApp, useData } from "../state/app";

export default function Home() {
  const { api, guest, setAskName } = useApp();
  const { upload, wish } = useActions();
  const stats = useData(() => api.stats());
  const recent = useData(() => api.photos(guest?.id ?? null, { sort: "new", limit: 6 }), [guest?.id]);
  const featured = useData(() => api.wishes().then((w) => w.filter((x) => x.featured).slice(0, 1)[0] ?? w[0] ?? null));
  const like = useLike();
  const [open, setOpen] = useState<number | null>(null);
  const photos = (recent.data?.items ?? []).map(like.view);

  return <div className="page home">
    <section className="hero" style={{ backgroundImage: `url(${wedding.hero})` }}>
      <div className="hero-text">
        <p className="eyebrow">{wedding.date}・{wedding.venue}</p>
        <h1>{wedding.couple.groom} <i>&</i> {wedding.couple.bride}</h1>
        <p>{guest ? `${guest.name}，謝謝你來參加我們的婚禮！` : "謝謝你來參加我們的婚禮！"}</p>
        {!guest && <button type="button" className="btn primary" onClick={() => setAskName(true)}>輸入名字開始</button>}
      </div>
    </section>

    <div className="quick">
      <button type="button" className="quick-btn" onClick={upload}><span className="qi rose"><Icon name="camera" size={22} /></span><b>上傳照片</b><small>拍到就傳，還能抽獎</small></button>
      <button type="button" className="quick-btn" onClick={wish}><span className="qi gold"><Icon name="pen" size={22} /></span><b>寫下祝福</b><small>給新人的悄悄話</small></button>
      <Link to="/ranking" className="quick-btn"><span className="qi sage"><Icon name="trophy" size={22} /></span><b>排行榜</b><small>誰拍得最好</small></Link>
    </div>

    <div className="home-now"><NowCard compact /></div>

    <section className="stats" aria-label="現場數字">
      {[["photos", "照片", "image"], ["likes", "愛心", "heart"], ["wishes", "祝福", "pen"], ["guests", "賓客", "user"]].map(([k, label, icon]) =>
        <div key={k} className="stat"><Icon name={icon as "image"} size={18} /><b>{stats.data ? stats.data[k as "photos"] : "–"}</b><span>{label}</span></div>)}
    </section>

    <section className="section">
      <header className="section-head"><h2>最新照片</h2><Link to="/photos" className="link">看全部 <Icon name="chevron-right" size={16} /></Link></header>
      <div className="masonry">
        {photos.map((p, i) => <PhotoTile key={p.id} photo={p} onOpen={() => setOpen(i)} onLike={(m) => like.toggle(p, m)} />)}
      </div>
      {recent.data && !photos.length && <p className="empty">還沒有照片，當第一個吧！</p>}
    </section>

    {featured.data && <section className="section">
      <header className="section-head"><h2>精選祝福</h2><Link to="/wishes" className="link">祝福牆 <Icon name="chevron-right" size={16} /></Link></header>
      <blockquote className="wish featured"><p>{featured.data.text}</p><cite>— {featured.data.guestName}</cite></blockquote>
    </section>}

    <section className="section">
      <header className="section-head"><h2>關於我們</h2></header>
      <div className="story">
        {wedding.story.map((s) => <figure key={s.title} className="story-card">
          <img src={s.img} alt={s.title} loading="lazy" />
          <figcaption><b>{s.title}</b><span>{s.text}</span></figcaption>
        </figure>)}
      </div>
    </section>

    <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} onLike={(p) => like.toggle(p)} />
  </div>;
}
