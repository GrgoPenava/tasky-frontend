export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  priority: number;
  notes: string | null;
  dueDate: string | null;
  teamId: string;
  assignedTo: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface CreateTaskData {
  title: string;
  description?: string | null;
  status: "todo" | "in_progress" | "done";
  priority: number;
  dueDate?: string | null;
  teamId: string;
  assignedTo?: string | null;
}

export interface UpdateTaskData {
  title?: string;
  description?: string | null;
  status?: "todo" | "in_progress" | "done";
  priority?: number;
  dueDate?: string | null;
  teamId?: string;
  assignedTo?: string | null;
  completedAt?: string | null;
}
