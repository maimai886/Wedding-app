import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "./Icon";

// focus the first field without scrolling the page behind (React autoFocus would scroll before the dialog opens)
export function showKeepingScroll(d: HTMLDialogElement) {
  const y = scrollY;
  d.showModal();
  d.querySelector<HTMLElement>("input, textarea")?.focus({ preventScroll: true });
  scrollTo({ top: y });
  requestAnimationFrame(() => scrollTo({ top: y })); // the focus scroll can land a frame later
}

// native <dialog>: focus trap, Esc and the backdrop come with it
export function Modal({ open, onClose, title, children, footer, variant = "center", wide }: {
  open: boolean; onClose: () => void; title?: string; children: ReactNode; footer?: ReactNode;
  variant?: "center" | "sheet"; wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) showKeepingScroll(d);
    if (!open && d.open) d.close();
  }, [open]);
  return <dialog ref={ref} className={`modal ${variant} ${wide ? "wide" : ""}`} onClose={onClose}
    onClick={(e) => { if (e.target === ref.current) onClose(); }} aria-label={title}>
    {open && <div className="modal-inner">
      {title && <header className="modal-head">
        <h2>{title}</h2>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="關閉"><Icon name="x" /></button>
      </header>}
      <div className="modal-body">{children}</div>
      {footer && <footer className="modal-foot">{footer}</footer>}
    </div>}
  </dialog>;
}

export function Confirm({ open, title, text, confirm = "確定", danger, onCancel, onConfirm }: {
  open: boolean; title: string; text: string; confirm?: string; danger?: boolean; onCancel: () => void; onConfirm: () => void;
}) {
  return <Modal open={open} onClose={onCancel} title={title} footer={<>
    <button type="button" className="btn ghost" onClick={onCancel}>取消</button>
    <button type="button" className={`btn ${danger ? "danger" : "primary"}`} onClick={onConfirm}>{confirm}</button>
  </>}><p className="muted">{text}</p></Modal>;
}
