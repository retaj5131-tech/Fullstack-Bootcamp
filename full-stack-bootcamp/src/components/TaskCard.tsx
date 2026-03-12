import Crescent from "../assets/Crescent.svg";

export type TaskCardProps = {
  id: number;
  title: string;
  description: string;
  date: string;
  activeCrescents?: number;
  totalCrescents?: number;
  summary?: string[];
  volunteersNeeded?: number;
  completed?: boolean;
  completedOn?: string;
  onClick?: () => void;
};

const TaskCard = ({
  title,
  date,
  activeCrescents = 0,
  totalCrescents = 5,
  completed = false,
  onClick,
}: TaskCardProps) => {
  return (
    <div
      className={`relative cursor-pointer rounded-xl p-4 shadow-md transition-all ${
        completed ? "border-2 border-[var(--gold-cream)]" : "border border-[var(--gold-cream)]/50"
      } bg-[var(--panel-deep)]`}
      onClick={onClick}
    >
      <h3 className="font-bold text-[var(--gold-primary)] text-lg">{title}</h3>
      <p className="text-sm text-amber-100/80">Date: {date}</p>
      <div className="flex gap-1 mt-2">
        {Array.from({ length: totalCrescents }).map((_, i) => (
          <img
            key={i}
            src={Crescent}
            alt=""
            className={`w-5 h-5 ${i < activeCrescents ? "crescent-active" : "crescent-inactive"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskCard;


