import { useState } from "react";
import { Icon } from "../components/Icon";
import { Lightbox, PhotoTile, useLike } from "../components/Photos";
import { useApp, useData } from "../state/app";

export default function Ranking() {
  const { api, guest } = useApp();
  const like = useLike();
  const top = useData(() => api.photos(guest?.id ?? null, { sort: "top", limit: 3 }), [guest?.id]);
  const people = useData(() => api.photographers());
  const draws = useData(() => api.draws());
  const [open, setOpen] = useState<number | null>(null);
  const photos = (top.data?.items ?? []).map(like.view);
  const max = Math.max(1, ...(people.data ?? []).map((p) => p.likes));

  return <div className="page">
    <header className="page-head"><h1>排行榜</h1><p className="muted">愛心最多的照片和攝影師，婚禮結束時頒小禮物。</p></header>

    <section className="section">
      <h2>最受歡迎的照片</h2>
      <div className="podium">
        {photos.map((p, i) => <PhotoTile key={p.id} photo={p} rank={i + 1} onOpen={() => setOpen(i)} onLike={(m) => like.toggle(p, m)} />)}
      </div>
    </section>

    <section className="section">
      <h2>攝影師</h2>
      <ol className="leaders">
        {people.data?.map((p, i) => <li key={p.guestId} className={p.guestId === guest?.id ? "mine" : ""}>
          <span className={`pos p${i + 1}`}>{i + 1}</span>
          <span className="avatar">{p.guestName[0]}</span>
          <div className="leader-main">
            <b>{p.guestName}{p.guestId === guest?.id && "（你）"}</b>
            <div className="bar"><i style={{ width: `${(p.likes / max) * 100}%` }} /></div>
          </div>
          <span className="leader-num"><Icon name="heart" size={14} filled />{p.likes}<small>{p.photos} 張</small></span>
        </li>)}
      </ol>
    </section>

    {!!draws.data?.length && <section className="section">
      <h2>抽獎結果</h2>
      <ul className="draws">{draws.data.map((d) => <li key={d.id}><Icon name="gift" size={18} /><b>{d.guestName}</b><span>{d.prize}</span></li>)}</ul>
    </section>}

    <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} onLike={(p) => like.toggle(p)} />
  </div>;
}
