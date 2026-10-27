import { useEffect, useRef, useState } from "react";
import { formatBytes, prepareImage, type Prepared } from "../lib/image";
import { useApp } from "../state/app";
import { Icon } from "./Icon";
import { Modal } from "./Modal";

interface Item extends Prepared { key: string; title: string; original: number }
const MAX_FILES = 10;

export function UploadSheet({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone?: () => void }) {
  const { api, guest, changed, toast } = useApp();
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState<"reading" | "sending" | null>(null);
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { if (!open) { setItems([]); setBusy(null); } }, [open]);

  const add = async (files: FileList | File[]) => {
    const list = [...files].filter((f) => f.type.startsWith("image/")).slice(0, MAX_FILES - items.length);
    if (!list.length) return toast("請選擇圖片檔", "error");
    setBusy("reading");
    const ready: Item[] = [];
    for (const f of list) {
      try {
        const p = await prepareImage(f);
        ready.push({ ...p, key: `${f.name}-${f.size}-${Math.random()}`, title: f.name.replace(/\.[^.]+$/, "").slice(0, 20), original: f.size });
      } catch (e) { toast((e as Error).message, "error"); }
    }
    setItems((cur) => [...cur, ...ready]);
    setBusy(null);
  };

  const send = async () => {
    if (!guest || !items.length) return;
    setBusy("sending");
    try {
      await api.upload(guest.id, items.map(({ title, src, width, height }) => ({ title, src, width, height })));
      toast(`上傳了 ${items.length} 張照片`);
      changed();
      onClose();
      onDone?.();
    } catch (e) { toast((e as Error).message, "error"); setBusy(null); }
  };

  const saved = items.reduce((s, i) => s + i.original - i.bytes, 0);
  return <Modal open={open} onClose={onClose} title="上傳照片" variant="sheet" wide footer={<>
    <span className="muted small">{items.length ? `${items.length} 張・上傳前已壓縮，省下 ${formatBytes(Math.max(0, saved))}` : `一次最多 ${MAX_FILES} 張`}</span>
    <button type="button" className="btn primary" disabled={!items.length || !!busy} onClick={send}>
      <Icon name="upload" size={18} />{busy === "sending" ? "上傳中…" : "上傳"}
    </button>
  </>}>
    <div className={`drop ${drag ? "over" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}>
      <div className="upload-grid">
        {items.map((it, i) => <figure key={it.key} className="upload-item">
          <img src={it.src} alt="" />
          <button type="button" className="icon-btn on-image" aria-label="移除這張" onClick={() => setItems((c) => c.filter((x) => x.key !== it.key))}><Icon name="x" size={16} /></button>
          <input aria-label="照片名稱" value={it.title} maxLength={20} placeholder="幫照片取個名字"
            onChange={(e) => setItems((c) => c.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} />
        </figure>)}
        {items.length < MAX_FILES && <button type="button" className="add-tile" onClick={() => input.current?.click()} disabled={busy === "reading"}>
          <Icon name="camera" size={28} />
          <span>{busy === "reading" ? "處理中…" : items.length ? "再加幾張" : "選照片或拖進來"}</span>
        </button>}
      </div>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => { if (e.target.files) add(e.target.files); e.target.value = ""; }} />
    </div>
  </Modal>;
}
