import { createContext, useContext, useState, type ReactNode } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { schedule, wedding, type IconName } from "../content";
import { locate } from "../lib/schedule";
import { useApp, useData, useRequireGuest } from "../state/app";
import { Icon } from "./Icon";
import { NameDialog } from "./NameDialog";
import { UploadSheet } from "./UploadSheet";
import { WishDialog } from "./WishDialog";

const nav: { to: string; label: string; icon: IconName }[] = [
  { to: "/", label: "首頁", icon: "home" },
  { to: "/schedule", label: "行程", icon: "calendar" },
  { to: "/photos", label: "照片牆", icon: "image" },
  { to: "/wishes", label: "祝福", icon: "pen" },
  { to: "/ranking", label: "排行榜", icon: "trophy" },
  { to: "/mine", label: "我的", icon: "user" },
];

interface Actions { upload: () => void; wish: () => void }
const ActionsCtx = createContext<Actions>({ upload: () => {}, wish: () => {} });
export const useActions = () => useContext(ActionsCtx);

export function Layout() {
  const need = useRequireGuest();
  const navigate = useNavigate();
  const [upload, setUpload] = useState(false);
  const [wish, setWish] = useState(false);
  const actions: Actions = {
    upload: () => need() && setUpload(true),
    wish: () => need() && setWish(true),
  };
  return <ActionsCtx.Provider value={actions}>
    <div className="shell">
      <Sidebar />
      <main className="main" id="main"><Outlet /></main>
      <SidePanel />
      <TabBar />
    </div>
    <NameDialog />
    <UploadSheet open={upload} onClose={() => setUpload(false)} onDone={() => navigate("/mine")} />
    <WishDialog open={wish} onClose={() => setWish(false)} />
  </ActionsCtx.Provider>;
}

function Sidebar() {
  const { guest, setAskName, leave } = useApp();
  const { upload } = useActions();
  return <aside className="sidebar">
    <div className="brand">
      <span className="brand-mark"><Icon name="heart" size={20} filled /></span>
      <div><b>{wedding.couple.groom} & {wedding.couple.bride}</b><span>{wedding.date}</span></div>
    </div>
    <nav aria-label="主選單">
      {nav.map((n) => <NavLink key={n.to} to={n.to} end={n.to === "/"} className="nav-item"><Icon name={n.icon} />{n.label}</NavLink>)}
    </nav>
    <button type="button" className="btn primary block" onClick={upload}><Icon name="camera" size={18} />上傳照片</button>
    <div className="sidebar-foot">
      {guest
        ? <div className="me"><span className="avatar">{guest.name[0]}</span><div><b>{guest.name}</b><button type="button" className="link" onClick={leave}>換人</button></div></div>
        : <button type="button" className="btn ghost block" onClick={() => setAskName(true)}>輸入名字</button>}
      <NavLink to="/host" className="host-link"><Icon name="settings" size={16} />新人管理</NavLink>
    </div>
  </aside>;
}

function TabBar() {
  const { upload } = useActions();
  const { pathname } = useLocation();
  const items = nav.filter((n) => n.to !== "/ranking");
  return <nav className="tabbar" aria-label="主選單">
    {items.slice(0, 2).map((n) => <NavLink key={n.to} to={n.to} end={n.to === "/"} className="tab"><Icon name={n.icon} /><span>{n.label}</span></NavLink>)}
    <button type="button" className="tab fab" onClick={upload} aria-label="上傳照片"><Icon name="camera" size={24} /></button>
    {items.slice(2, 4).map((n) => <NavLink key={n.to} to={n.to} className="tab"><Icon name={n.icon} /><span>{n.label}</span></NavLink>)}
    <NavLink to="/mine" className={`tab ${pathname === "/ranking" ? "active" : ""}`}><Icon name="user" /><span>我的</span></NavLink>
  </nav>;
}

// desktop right column: what is happening now and what I have done
function SidePanel() {
  const { api, guest, clock } = useApp();
  const { wish } = useActions();
  const where = locate(schedule, clock.minute);
  const mine = useData(() => (guest ? api.myPhotos(guest.id) : Promise.resolve([])), [guest?.id]);
  const myWish = useData(() => (guest ? api.myWish(guest.id) : Promise.resolve(null)), [guest?.id]);
  const likes = (mine.data ?? []).reduce((s, p) => s + p.likes, 0);
  return <aside className="sidepanel" aria-label="現在">
    <NowCard />
    <section className="panel-card">
      <h3>你的參與</h3>
      {guest ? <>
        <div className="mini-stats">
          <div><b>{mine.data?.length ?? "–"}</b><span>張照片</span></div>
          <div><b>{likes}</b><span>個愛心</span></div>
        </div>
        <p className="muted small">{mine.data?.length ? "已有抽獎資格 🎉" : "上傳一張照片就能參加抽獎"}</p>
      </> : <p className="muted small">輸入名字後就能看到自己的照片和愛心。</p>}
    </section>
    <section className="panel-card">
      <h3>你的祝福</h3>
      {myWish.data ? <blockquote className="my-wish">{myWish.data.text}</blockquote> : <p className="muted small">還沒寫，說點什麼吧。</p>}
      <button type="button" className="btn ghost sm" onClick={wish}><Icon name="pen" size={16} />{myWish.data ? "修改" : "寫祝福"}</button>
    </section>
    {where.next && <p className="muted small center">下一個：{where.next.start} {where.next.title}</p>}
  </aside>;
}

export function NowCard({ compact }: { compact?: boolean }) {
  const { clock } = useApp();
  const w = locate(schedule, clock.minute);
  let body: ReactNode;
  if (w.current) body = <>
    <span className="eyebrow">現在進行中・{w.current.start}–{w.current.end}</span>
    <b className="now-title">{w.current.title}</b>
    <p className="muted small">{w.current.detail}</p>
    <div className="bar" role="progressbar" aria-valuenow={Math.round(w.progress * 100)} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${w.progress * 100}%` }} /></div>
  </>;
  else if (w.phase === "before") body = <><span className="eyebrow">還沒開始</span><b className="now-title">別緊張，{w.next?.start} 開始！</b></>;
  else body = <><span className="eyebrow">婚禮結束</span><b className="now-title">謝謝你今天來 🤍</b><p className="muted small">照片牆會一直開著，可以慢慢傳。</p></>;
  return <section className={`panel-card now ${compact ? "compact" : ""}`}>
    {w.current && <img src={w.current.img} alt="" className="now-img" />}
    <div>{body}</div>
    {!clock.live && <span className="sim-tag" title="不是婚禮當天，展示模式用模擬時間">模擬時間 {Math.floor(clock.minute / 60)}:{String(Math.floor(clock.minute % 60)).padStart(2, "0")}</span>}
  </section>;
}
