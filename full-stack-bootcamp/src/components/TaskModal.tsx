import { useEffect } from "react";
import { createPortal } from "react-dom";
import Crescent from "../assets/Crescent.svg";
import type { TaskCardProps } from "./TaskCard";

type TaskModalProps = TaskCardProps & {
  open: boolean;
  onClose: () => void;
  onToggleCompleted?: () => void;
  onUpdate?: (changes: Partial<TaskCardProps>) => void;
  onDelete?: () => void;
};

const TaskModal = ({
  open,
  onClose,
  onToggleCompleted,
  title,
  description,
  date,
  activeCrescents = 0,
  totalCrescents = 5,
  summary = [],
  volunteersNeeded,
  completed = false,
  completedOn,
  onUpdate,
  onDelete,
}: TaskModalProps) => {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "var(--panel-deep)",
          border: completed ? "1px solid var(--gold-cream)" : "1px solid rgba(212,175,55,0.5)",
          boxShadow: completed ? "0 0 40px 8px rgba(212,175,55,0.22)" : "0 0 40px 6px rgba(212,175,55,0.15)",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "rgba(212,175,55,0.2)" }}
        >
          <h2 className="flex-1 text-center font-bold text-sm tracking-[0.15em] uppercase" style={{ color: "var(--gold-cream)" }}>
            {title} Task Details
          </h2>
          <button onClick={onClose} className="ml-4 w-8 h-8 flex items-center justify-center rounded-full" style={{ border: "1px solid rgba(255,241,170,0.4)", color: "rgba(255,241,170,0.8)" }}>
            ✕
          </button>
        </div>

        <div className="px-6 pt-5 pb-6 flex flex-col gap-4">
          <div className="flex flex-col items-center gap-3">
            <h1 className="font-bold text-3xl font-lexend" style={{ color: "var(--gold-primary)" }}>{title}</h1>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalCrescents }).map((_, i) => (
                <img key={i} src={Crescent} alt="" className={`w-7 h-7 ${i < activeCrescents ? "crescent-active" : "crescent-inactive"}`} />
              ))}
            </div>
            <p className="font-semibold text-sm" style={{ color: "var(--gold-cream)" }}>Date: {date}</p>
          </div>

          {summary.length > 0 && (
            <div>
              <p className="font-bold text-sm mb-2" style={{ color: "var(--gold-primary)" }}>Summary:</p>
              <ul className="space-y-1 pl-1">
                {summary.map((item, i) => <li key={i} className="text-sm text-amber-100/80">• {item}</li>)}
              </ul>
            </div>
          )}

          {volunteersNeeded && (
            <div>
              <p className="font-bold text-sm mb-1" style={{ color: "var(--gold-primary)" }}>Volunteers Needed:</p>
              <p className="text-sm text-amber-100/80">{volunteersNeeded} volunteers required</p>
            </div>
          )}

          {completed ? (
            <button onClick={onToggleCompleted} className="mt-2 w-full py-3 rounded-full border-2 text-sm font-bold tracking-widest" style={{ borderColor: "rgba(212,175,55,0.6)", color: "rgba(212,175,55,0.8)" }}>
              ✓ COMPLETED
            </button>
          ) : (
            <button onClick={onToggleCompleted} className="mt-2 w-full py-3 rounded-full text-sm font-bold tracking-widest" style={{ background: "linear-gradient(to right, #C9A227, #E8C84A)", color: "#0A1128" }}>
              MARK AS COMPLETED
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TaskModal;