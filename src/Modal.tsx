import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import s from './App.module.css';

/** Native modal: inert background, focus containment, Escape and focus restoration. */
export function Modal({ title, children, onClose, drawer = false }: { title: string; children: ReactNode; onClose: () => void; drawer?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return createPortal(<dialog ref={ref} className={`${s.modal} ${drawer ? s.drawer : ''}`} aria-label={title} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className={s.modalInner}><div className={s.modalHeading}><h2>{title}</h2><button autoFocus className={s.iconButton} onClick={onClose} aria-label={`Закрити: ${title}`}><X size={22}/></button></div>{children}</div>
  </dialog>, document.body);
}
