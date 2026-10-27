import { Icon } from "../components/Icon";
import { schedule } from "../content";
import { fromMinutes, locate, range, toMinutes } from "../lib/schedule";
import { useApp } from "../state/app";

export default function Schedule() {
  const { clock } = useApp();
  const where = locate(schedule, clock.minute);
  const { from, to } = range(schedule);
  return <div className="page">
    <header className="page-head">
      <h1>今日行程</h1>
      <p className="muted">每個環節開始時，這裡和首頁都會跟著更新。</p>
    </header>

    <div className="sim panel-card">
      <div className="sim-row">
        <Icon name="clock" />
        <b>{fromMinutes(clock.minute)}</b>
        <span className="muted small">{clock.live ? "現在時間" : "模擬時間：拖曳看看當天每個時段"}</span>
        {!clock.live && <button type="button" className="link" onClick={clock.goLive}>重設</button>}
      </div>
      <input type="range" min={from} max={to} step={5} value={Math.round(clock.minute)} aria-label="模擬婚禮當天的時間"
        onChange={(e) => clock.setMinute(+e.target.value)} />
    </div>

    <ol className="timeline">
      {schedule.map((it, i) => {
        const state = i === where.index ? "now" : toMinutes(it.end) <= clock.minute ? "done" : "later";
        return <li key={it.id} className={`tl ${state}`} aria-current={state === "now" ? "step" : undefined}>
          <span className="tl-dot"><Icon name={state === "done" ? "star" : it.icon} size={16} filled={state === "done"} /></span>
          <div className="tl-card">
            <div className="tl-text">
              <span className="tl-time">{it.start} – {it.end}{state === "now" && <em>進行中</em>}</span>
              <b>{it.title}</b>
              <p className="muted">{it.detail}</p>
              {state === "now" && <div className="bar"><i style={{ width: `${where.progress * 100}%` }} /></div>}
            </div>
            <div className="tl-img"><img src={it.img} alt="" loading="lazy" /></div>
          </div>
        </li>;
      })}
    </ol>
  </div>;
}
