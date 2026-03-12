// ─────────────────────────────────────────────────────────────
//  api.ts  –  All communication with the Flask backend lives here.
//
//  Base URL: the Flask dev server running on port 5000.
//  If you ever deploy, change this one constant and everything
//  else will update automatically.
// ─────────────────────────────────────────────────────────────

const BASE_URL = "http://localhost:5000";

export type Task = {
  id: number;
  title: string;
  description: string;
  date: string;
  activeCrescents: number;
  variant?: "small" | "wide";
  completed?: boolean;
  completedOn?: string;
  summary?: string[];
  volunteersNeeded?: number;
};

function mapTask(raw: any): Task {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    date: raw.date,
    activeCrescents: raw.priority ?? 0,
    variant: raw.variant,
    completed: raw.completed,
    completedOn: raw.completedOn,
    summary: raw.summary,
    volunteersNeeded: raw.volunteersNeeded,
  };
}

export async function getAllTasks(): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}/todos`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  const data = await res.json();
  return data.map(mapTask);
}

export async function createTask(description: string): Promise<Task> {
  const res = await fetch(`${BASE_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return mapTask(await res.json());
}

export async function updateTask(id: number, updates: Partial<Omit<Task, "id">>): Promise<Task> {
  const body: Record<string, unknown> = { ...updates };
  if ("activeCrescents" in body) {
    body.priority = body.activeCrescents;
    delete body.activeCrescents;
  }
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return mapTask(await res.json());
}

export async function deleteTask(id: number): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/todos/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete task");
  return true;
}