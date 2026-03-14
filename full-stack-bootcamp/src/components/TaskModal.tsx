import { useEffect } from "react";
import { createPortal } from "react-dom";
import Crescent from "../assets/fire.png";
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
  onUpdate,
  onDelete,
  title,
  description,
  date,
  activeCrescents = 0,
  summary = [],
  volunteersNeeded,
  completed = false,
  completedOn,
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
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-md bg-[#0A0F2D] ${
          completed
            ? "border border-blue-500 shadow-[0_0_40px_8px_rgba(59,130,246,0.3)]"
            : "border border-blue-500/50 shadow-[0_0_40px_6px_rgba(59,130,246,0.15)]"
        } rounded-2xl overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-700/20">
          <h2 className="flex-1 text-center font-bold text-blue-300 text-sm tracking-[0.15em] uppercase">
            {title} Task Details
          </h2>
          <button
            onClick={onClose}
            className="ml-4 w-8 h-8 flex items-center justify-center rounded-full border border-blue-300/40 text-blue-300/80 hover:border-blue-300 hover:text-blue-300 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pt-5 pb-6 flex flex-col gap-4">
          <div className="flex flex-col items-center gap-3">
            <h1 className="font-bold text-blue-200 text-3xl font-lexend">{title}</h1>

            {/* Crescents */}
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <img
                  key={i}
                  src={Crescent}
                  alt={i < activeCrescents ? "active" : "inactive"}
                  className={"w-7 h-7 " + (i < activeCrescents ? "crescent-active" : "crescent-inactive")}
                />
              ))}
            </div>

            <p className="font-semibold text-blue-300 text-sm">Date: {date}</p>
          </div>

          <div className="border-t border-blue-700/15" />

          {/* Description */}
          <div>
            <p className="font-bold text-blue-300 text-sm mb-1">Description</p>
            <p className="text-blue-100/80 text-sm leading-relaxed">{description}</p>
          </div>

          {/* Summary */}
          {summary.length > 0 && (
            <div>
              <p className="font-bold text-blue-300 text-sm mb-2">Summary:</p>
              <ul className="space-y-1 pl-1">
                {summary.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-blue-100/80">
                    <span className="text-blue-200/60 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Volunteers Needed */}
          {volunteersNeeded && (
            <div>
              <p className="font-bold text-blue-300 text-sm mb-1">Volunteers Needed:</p>
              <p className="text-sm text-blue-100/80 flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0 text-blue-400 fill-blue-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
                <span>{volunteersNeeded} volunteers required</span>
              </p>
            </div>
          )}

          {/* Completed Banner */}
          {completed && (
            <div className="w-full flex flex-col items-center gap-2 mt-2">
              <div className="flex items-center w-full justify-center gap-4">
                <span className="h-1 rounded bg-blue-400 w-20" />
                <span className="text-blue-300 text-2xl font-bold tracking-wide">Completed</span>
                <span className="h-1 rounded bg-blue-400 w-20" />
              </div>
              <p className="text-blue-200/60 text-sm">{completedOn ?? date}</p>
            </div>
          )}

          {/* CTA Button */}
          {completed ? (
            <button
              onClick={() => onToggleCompleted?.()}
              className="mt-1 w-full py-3 rounded-full border-2 border-blue-400/60 text-blue-300/80 text-sm font-bold tracking-widest hover:border-blue-300 hover:text-blue-300 transition-all flex items-center justify-center gap-2"
            >
              <span>✓</span>
              <span>COMPLETED{completedOn ? ` · ${completedOn}` : ""}</span>
            </button>
          ) : (
            <button
              onClick={() => onToggleCompleted?.()}
              className="mt-1 w-full py-3 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 text-blue-50 font-bold text-sm tracking-widest hover:brightness-110 transition-all shadow-[0_0_18px_2px_rgba(59,130,246,0.3)]"
            >
              MARK AS COMPLETED
            </button>
          )}
          {/* ── CTA Delete Button ── */}
{onDelete && (
  <button
    onClick={() => {
      if (confirm("Are you sure you want to delete this task?")) {
        onDelete();
        onClose();
      }
    }}
    className="mt-2 w-full py-3 rounded-full bg-red-600 text-white font-bold text-sm tracking-widest hover:bg-red-700 transition-all shadow-[0_0_12px_2px_rgba(220,38,38,0.3)]"
  >
    DELETE TASK
  </button>
)}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TaskModal;