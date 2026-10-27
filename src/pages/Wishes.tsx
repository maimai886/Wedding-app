import { Icon } from "../components/Icon";
import { useActions } from "../components/Layout";
import { ago } from "../lib/format";
import { useApp, useData } from "../state/app";

export default function Wishes() {
  const { api, guest } = useApp();
  const { wish } = useActions();
  const list = useData(() => api.wishes());
  const mine = list.data?.find((w) => w.guestId === guest?.id);
  return <div className="page">
    <header className="page-head row between wrap">
      <div><h1>祝福牆</h1><p className="muted">大家寫給 Ren & Hana 的話。星號是新人選的精選。</p></div>
      <button type="button" className="btn primary" onClick={wish}><Icon name="pen" size={18} />{mine ? "修改我的祝福" : "寫祝福"}</button>
    </header>
    <div className="wishes">
      {list.data?.map((w, i) => <blockquote key={w.id} className={`wish tone${i % 4} ${w.featured ? "featured" : ""} ${w.guestId === guest?.id ? "mine" : ""}`}>
        {w.featured && <span className="star" title="精選"><Icon name="star" size={16} filled /></span>}
        <p>{w.text}</p>
        <cite>— {w.guestName}{w.guestId === guest?.id && "（你）"}<small>{ago(w.updatedAt)}</small></cite>
      </blockquote>)}
    </div>
    {list.data && !list.data.length && <p className="empty">還沒有人寫祝福。</p>}
  </div>;
}
