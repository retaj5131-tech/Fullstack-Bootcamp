import { useState } from "react";
import StarIcon from "../assets/AI.png";
import AddIcon from "../assets/pen.png";
import { createTask } from "../api";
import type { Task } from "../api";

type InputProps = {
  onTaskAdded: (task: Task) => void;
};

const Input = ({ onTaskAdded }: InputProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    try {
      const newTask = await createTask(trimmed);
      onTaskAdded(newTask);
      setValue("");
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="relative w-full max-w-4xl">
        <input
          aria-label="Add task"
          placeholder="Add your Next Coding Challenge..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full bg-[var(--bg-dark)] bg-opacity-20 backdrop-blur-[3px] border border-white rounded-full py-4 px-6 pl-12 placeholder:text-purple-300 text-blue-300 outline-none focus:border-blue focus:ring-2 focus:ring-blue"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center">
          <img src={StarIcon} alt="" className="w-8 h-8" />
        </span>
      </div>
      <button
        onClick={handleSubmit}
        aria-label="Submit task"
        className="ml-4 px-4 py-4 rounded-full bg-[var(--bg-dark)] bg-opacity-20 backdrop-blur-[3px] border border-white text-blue-300 hover:border-[var(--white-cream)]"
      >
        <img src={AddIcon} alt="Add Icon" className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Input;

