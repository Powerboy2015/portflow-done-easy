import { useEffect } from "react";
import { BTN, HEADING, PANEL } from "./ui";

type ConfirmDialogProps = {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

// Module-level component; interaction logic runs via event handlers
// (rerender-move-effect-to-event). The Escape listener is a genuine
// external subscription, so it lives in an effect.
export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="pde-confirm-titel"
        aria-describedby="pde-confirm-body"
        className={`${PANEL} w-full max-w-[440px]`}
      >
        <h2 id="pde-confirm-titel" className={HEADING}>
          {title}
        </h2>
        <p id="pde-confirm-body" className="mb-3 break-words whitespace-pre-wrap">
          {body}
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            autoFocus
            className="border-2 border-black bg-white px-3.5 py-1.5 font-bold text-black hover:bg-black hover:text-white"
            onClick={onCancel}
          >
            [Annuleren]
          </button>
          <button type="button" className={BTN} onClick={onConfirm}>
            [{confirmLabel}]
          </button>
        </div>
      </section>
    </div>
  );
}
