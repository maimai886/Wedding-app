import { useEffect, useState } from "react";
import { useApp, useData } from "../state/app";
import { Modal } from "./Modal";

const MAX = 120;
const ideas = ["新婚快樂，百年好合！", "要一直這麼幸福喔", "蜜月照片記得分享～"];

export function WishDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { api, guest, changed, toast } = useApp();
  const mine = useData(() => (guest ? api.myWish(guest.id) : Promise.resolve(null)), [guest?.id, open]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (open) setText(mine.data?.text ?? ""); }, [open, mine.data]);

  const save = async () => {
    if (!guest) return;
    setBusy(true);
    try {
      await api.saveWish(guest.id, text);
      toast(mine.data ? "祝福已更新" : "收到你的祝福了！");
      changed();
      onClose();
    } catch (e) { toast((e as Error).message, "error"); }
    finally { setBusy(false); }
  };

  return <Modal open={open} onClose={onClose} title={mine.data ? "修改祝福" : "寫下祝福"} footer={<>
    <button type="button" className="btn ghost" onClick={onClose}>取消</button>
    <button type="button" className="btn primary" disabled={!text.trim() || busy} onClick={save}>{busy ? "送出中…" : "送出"}</button>
  </>}>
    <label className="field">
      <span>給 Ren & Hana 的話</span>
      <textarea rows={4} value={text} maxLength={MAX} onChange={(e) => setText(e.target.value)} placeholder="寫下你想對新人說的話" />
      <small className={`count ${text.length > MAX - 10 ? "warn" : ""}`}>{text.length} / {MAX}</small>
    </label>
    {!text && <div className="chips">{ideas.map((s) => <button key={s} type="button" className="chip" onClick={() => setText(s)}>{s}</button>)}</div>}
    <p className="muted small">每人一則，之後可以再改。新人會挑幾則放到祝福牆最上面。</p>
  </Modal>;
}
