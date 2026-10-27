import { useEffect, useState } from "react";
import { wedding } from "../content";
import { useApp } from "../state/app";
import { Modal } from "./Modal";

export function NameDialog() {
  const { askName, setAskName, join, guest, toast } = useApp();
  const [name, setName] = useState(guest?.name ?? "");
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (askName) setName(guest?.name ?? ""); }, [askName, guest]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      const g = await join(name);
      toast(`歡迎，${g.name}！`);
      setAskName(false);
    } catch (err) { toast((err as Error).message, "error"); }
    finally { setBusy(false); }
  };

  return <Modal open={askName} onClose={() => setAskName(false)} title="歡迎來到我們的婚禮">
    <form onSubmit={submit} className="name-form">
      <img src={wedding.hero} alt="" className="name-art" />
      <p className="muted">輸入名字就能上傳照片、按愛心、寫祝福，還能參加抽獎。同一個名字再輸入一次就會回到原本的帳號。</p>
      <label className="field">
        <span>你的名字</span>
        <input value={name} maxLength={12} onChange={(e) => setName(e.target.value)} placeholder="例如：小美" />
      </label>
      <div className="row end">
        <button type="button" className="btn ghost" onClick={() => setAskName(false)}>先逛逛</button>
        <button type="submit" className="btn primary" disabled={!name.trim() || busy}>{busy ? "進場中…" : "開始"}</button>
      </div>
    </form>
  </Modal>;
}
