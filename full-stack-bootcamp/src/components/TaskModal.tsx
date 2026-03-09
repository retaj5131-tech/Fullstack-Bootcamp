import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Crescent from "../assets/Crescent.svg";
import type { TaskCardProps } from "./TaskCard";
import type { Task } from "../api";

// ── Props ─────────────────────────────────────────────────────
// TaskModal gets its display data from TaskCardProps (same as TaskCard)
// plus three extra callbacks for backend actions.
type TaskModalProps = TaskCardProps & {
  open: boolean;
  onClose: () => void;
  onToggleCompleted?: () => void;
  onUpdate?: (changes: Partial<Task>) => void;  // save edits → PUT
  onDelete?: () => void;                         // delete task → DELETE
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

  // ── Edit mode state ───────────────────────────────────────────
  // When `isEditing` is true we show the edit form instead of the
  // read-only view.  The form fields are controlled by these states.
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [editVolunteers, setEditVolunteers] = useState(volunteersNeeded ?? 0);
  const [editCrescents, setEditCrescents] = useState(activeCrescents);

  // ── Close on Escape key ───────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // If editing, cancel edit first; second Escape closes the modal.
        if (isEditing) setIsEditing(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, isEditing]);

  if (!open) return null;

  // ── Save edits ────────────────────────────────────────────────
  // Collect the edited field values and pass them to onUpdate()
  // (which is defined in App.tsx and calls updateTask from api.ts).
  const handleSave = () => {
    onUpdate?.({
      title: editTitle,
      description: editDescription,
      volunteersNeeded: editVolunteers,
      activeCrescents: editCrescents,
    });
    setIsEditing(false);
  };

  // ── Shared label / input styles ───────────────────────────────
  const labelCls = "font-bold text-(--gold-primary) text-sm mb-1";
  const inputCls =
    "w-full bg-(--bg-dark)/40 border border-(--gold-cream)/40 rounded-lg px-3 py-2 text-amber-100 text-sm outline-none focus:border-(--gold-cream) focus:ring-1 focus:ring-(--gold-primary)";

  return createPortal(
    // Backdrop — blur + dark overlay on the fixed container itself
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal panel */}
      <div
        className={`relative w-full max-w-md bg-(--panel-deep) ${completed ? "border border-(--gold-cream) shadow-[0_0_40px_8px_rgba(212,175,55,0.22)]" : "border border-(--gold-cream)/50 shadow-[0_0_40px_6px_rgba(212,175,55,0.15)]"} rounded-2xl overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header bar ────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--gold-cream)/20">
          <h2 className="flex-1 text-center font-bold text-(--gold-cream) text-sm tracking-[0.15em] uppercase">
            {isEditing ? "Edit Task" : `${title} Task Details`}
          </h2>
          <button
            onClick={onClose}
            className="ml-4 w-8 h-8 flex items-center justify-center rounded-full border border-[#FFF1AA]/40 text-[#FFF1AA]/80 hover:border-[#FFF1AA] hover:text-[#FFF1AA] transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* ── Body ──────────────────────────────────────────────── */}
        <div className="px-6 pt-5 pb-6 flex flex-col gap-4">

          {/* ════════════════════════════════════════════════════
              EDIT MODE — shown when the pencil button is clicked
              ════════════════════════════════════════════════════ */}
          {isEditing ? (
            <>
              {/* Title field */}
              <div>
                <p className={labelCls}>Title</p>
                <input
                  className={inputCls}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>

              {/* Description field */}
              <div>
                <p className={labelCls}>Description</p>
                <textarea
                  className={inputCls + " resize-none h-24"}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>

              {/* Volunteers needed */}
              <div>
                <p className={labelCls}>Volunteers Needed</p>
                <input
                  type="number"
                  min={0}
                  className={inputCls}
                  value={editVolunteers}
                  onChange={(e) => setEditVolunteers(Number(e.target.value))}
                />
              </div>

              {/* Priority crescents — clickable row of 5 */}
              <div>
                <p className={labelCls}>Priority (crescents)</p>
                <div className="flex items-center gap-2 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} onClick={() => setEditCrescents(i + 1)} type="button">
                      <img
                        src={Crescent}
                        alt={`${i + 1} crescents`}
                        className={"w-7 h-7 " + (i < editCrescents ? "crescent-active" : "crescent-inactive")}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Save / Cancel */}
              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 py-2 rounded-full bg-linear-to-r from-[#C9A227] to-[#E8C84A] text-[#0A1128] font-bold text-sm tracking-widest hover:brightness-110 transition-all"
                >
                  SAVE
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 rounded-full border border-[#FFF1AA]/40 text-[#FFF1AA]/70 text-sm font-bold hover:border-[#FFF1AA] transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </>
          ) : (
            /* ═══════════════════════════════════════════════════
               VIEW MODE — the default read-only layout
               ═══════════════════════════════════════════════════ */
            <>
              {/* Large title + crescents + date */}
              <div className="flex flex-col items-center gap-3">
                <h1 className="font-bold text-(--gold-primary) text-3xl font-lexend">{title}</h1>

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

                <p className="font-semibold text-(--gold-cream) text-sm">Date: {date}</p>
              </div>

              {/* Divider */}
              <div className="border-t border-(--gold-cream)/15" />

              {/* Description */}
              <div>
                <p className="font-bold text-(--gold-primary) text-sm mb-1">Description</p>
                <p className="text-amber-100/80 text-sm leading-relaxed">{description}</p>
              </div>

              {/* Summary */}
              {summary.length > 0 && (
                <div>
                  <p className="font-bold text-(--gold-primary) text-sm mb-2">Summary:</p>
                  <ul className="space-y-1 pl-1">
                    {summary.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-amber-100/80">
                        <span className="text-amber-200/60 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Volunteers Needed */}
              {volunteersNeeded && (
                <div>
                  <p className="font-bold text-(--gold-primary) text-sm mb-1">Volunteers Needed:</p>
                  <p className="text-sm text-amber-100/80 flex items-center gap-2">
                    <svg className="w-5 h-5 shrink-0 text-[#D4AF37] fill-[#D4AF37]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                    <span>{volunteersNeeded} volunteers required</span>
                  </p>
                </div>
              )}

              {/* Completed banner */}
              {completed && (
                <div className="w-full flex flex-col items-center gap-2 mt-2">
                  <div className="flex items-center w-full justify-center gap-4">
                    <span className="h-1 rounded bg-(--gold-cream) w-20" />
                    <span className="text-(--gold-bright) text-2xl font-bold tracking-wide">Completed</span>
                    <span className="h-1 rounded bg-(--gold-cream) w-20" />
                  </div>
                  <p className="text-amber-200/60 text-sm">{completedOn ?? date}</p>
                </div>
              )}

              {/* ── CTA buttons ── */}
              {completed ? (
                <button
                  onClick={() => onToggleCompleted?.()}
                  className="mt-1 w-full py-3 rounded-full border-2 border-[#D4AF37]/60 text-[#D4AF37]/80 text-sm font-bold tracking-widest hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all flex items-center justify-center gap-2"
                >
                  <span>✓</span>
                  <span>COMPLETED{completedOn ? ` · ${completedOn}` : ""}</span>
                </button>
              ) : (
                <button
                  onClick={() => onToggleCompleted?.()}
                  className="mt-1 w-full py-3 rounded-full bg-linear-to-r from-[#C9A227] to-[#E8C84A] text-[#0A1128] font-bold text-sm tracking-widest hover:brightness-110 transition-all shadow-[0_0_18px_2px_rgba(212,175,55,0.3)]"
                >
                  MARK AS COMPLETED
                </button>
              )}

              {/* Edit + Delete row */}
              <div className="flex gap-3">
                {/* Edit button — switches to edit mode */}
                <button
                  onClick={() => {
                    // Reset edit fields to the latest prop values before showing the form
                    setEditTitle(title);
                    setEditDescription(description);
                    setEditVolunteers(volunteersNeeded ?? 0);
                    setEditCrescents(activeCrescents);
                    setIsEditing(true);
                  }}
                  className="flex-1 py-2 rounded-full border border-[#FFF1AA]/40 text-[#FFF1AA]/70 text-sm font-bold hover:border-[#FFF1AA] hover:text-[#FFF1AA] transition-colors"
                >
                  EDIT
                </button>

                {/* Delete button — calls onDelete (defined in App.tsx) */}
                <button
                  onClick={() => onDelete?.()}
                  className="flex-1 py-2 rounded-full border border-red-400/40 text-red-400/70 text-sm font-bold hover:border-red-400 hover:text-red-400 transition-colors"
                >
                  DELETE
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TaskModal;

