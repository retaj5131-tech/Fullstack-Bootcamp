import { useState } from "react";
import StarIcon from "../assets/Star Icon.png";
import AddIcon from "../assets/Edit Icon.png";
import { createTask } from "../api";
import type { Task } from "../api";

// ── Props ─────────────────────────────────────────────────────
// App.tsx passes `onTaskAdded` so it can add the new task to the
// list immediately without re-fetching everything from the server.
type InputProps = {
  onTaskAdded: (task: Task) => void;
};

const Input = ({ onTaskAdded }: InputProps) => {
  // `value` tracks whatever the user has typed in the input field.
  const [value, setValue] = useState("");

  // Called when the user presses Enter or clicks the add button.
  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed) return; // do nothing if the field is empty

    try {
      // Send the description to Flask → Gemini generates the full task.
      const newTask = await createTask(trimmed);
      onTaskAdded(newTask); // bubble the result up to App.tsx
      setValue("");          // clear the input field
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="relative w-full max-w-4xl">
        <input
          aria-label="Add task"
          placeholder="Add your Next Ramadan Task Here......"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full bg-(--bg-dark) bg-opacity-20 backdrop-blur-[3px] border border-(--gold-cream) rounded-full py-4 px-6 pl-12 placeholder:text-amber-200/50 text-amber-100 outline-none focus:border-(--gold-cream) focus:ring-2 focus:ring-(--gold-primary)"
        />

        {/* Right decoration icon (non-interactive) */}
        <span className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center">
          <img src={StarIcon} alt="" className="w-8 h-8" />
        </span>
      </div>

      {/* Add button */}
      <button
        onClick={handleSubmit}
        aria-label="Submit task"
        className="ml-4 px-4 py-4 rounded-full bg-(--bg-dark) bg-opacity-20 backdrop-blur-[3px] border border-(--gold-cream) text-amber-100 hover:border-(--gold-cream)"
      >
        <img src={AddIcon} alt="Add Icon" className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Input;

