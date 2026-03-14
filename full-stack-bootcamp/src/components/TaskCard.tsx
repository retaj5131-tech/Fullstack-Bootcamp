import Crescent from "../assets/fire.png";
import Lantern  from "../assets/game.png";

export type TaskCardProps = {
  title: string;
  description: string;
  date: string;
  activeCrescents?: number;   
  variant?: "small" | "wide"; 
  completed?: boolean;
  completedOn?: string;       
  summary?: string[];         
  volunteersNeeded?: number;  
  onClick?: () => void;       
};

const TaskCard = ({
  title,
  description,
  date,
  activeCrescents = 0,
  variant = "small",
  completed = false,
  completedOn,
  onClick,
}: TaskCardProps) => {
  const isWide = variant === "wide";

  return (
    <div
      onClick={onClick}
      className={[
        "relative bg-[var(--bg-dark)] bg-opacity-20 backdrop-blur-[3px]",
        "border rounded-2xl flex flex-col items-center",
        "px-6 pt-4 pb-5 overflow-hidden",
        completed
          ? "border-[var(--blue-cream)] shadow-[0_0_20px_3px_rgba(212,175,55,0.18)]"
          : "border-[var(--blue-cream)]",
        isWide ? "md:col-span-2" : "",
        onClick ? "cursor-pointer hover:border-[var(--blue-cream)] transition-colors duration-200" : "",
      ].filter(Boolean).join(" ")}
    >
      {/* Completed dim overlay */}
      {completed && (
        <div className="absolute inset-0 bg-[var(--bg-dark)] bg-opacity-25 rounded-2xl pointer-events-none" />
      )}

      {/* Top row — lantern | title | lantern */}
      <div className="relative w-full flex items-center justify-between gap-2 min-h-12">
        <img src={Lantern} alt="" className={`w-5 h-8 shrink-0 ${completed ? "opacity-50" : "opacity-85"}`} />
        <h3 className={`font-medium text-center text-base leading-tight ${completed ? "text-[var(--text-cream)]/70" : "text-[var(--text-cream)]"}`}>
          {title}
        </h3>
        <img src={Lantern} alt="" className={`w-5 h-8 shrink-0 ${completed ? "opacity-50" : "opacity-85"}`} />
      </div>

      {/* Description */}
      <p className={`relative flex-1 flex items-center text-center leading-snug text-sm mt-2 px-1
                     ${completed ? "text-purple-500/45" : "text-purple-500/30"}`}>
        {description}
      </p>

      {/* Crescent row — priority indicator */}
      <div className="relative flex items-center gap-1 mt-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <img
            key={i}
            src={Crescent}
            alt={i < activeCrescents ? "active" : "inactive"}
            className={"w-6 h-6 " + (i < activeCrescents ? "crescent-active" : "crescent-inactive")}
          />
        ))}
      </div>

      {/* Footer — date or completed stamp */}
      {completed ? (
        <div className="relative w-full mt-3">
          <div className="flex items-center gap-2 w-full">
            <span className="flex-1 border-t-2 border-[var(--blue-bright)]/70" />
            <span className="text-[var(--blue-bright)] text-base font-bold tracking-wide whitespace-nowrap">
              Completed
            </span>
            <span className="flex-1 border-t-2 border-[var(--blue-bright)]/70" />
          </div>
          <p className="text-center text-pink-400 text-xs mt-1">
            {completedOn ?? date}
          </p>
        </div>
      ) : (
        <p className="text-pink-400/40 text-xs mt-3">{date}</p>
      )}
    </div>
  );
};

export default TaskCard;