import ApiService from "./ApiService";
import type { Task, CreateTaskData, UpdateTaskData } from "@/models/Task";

class TaskService {
  public async getTasksByTeam(teamId: string): Promise<Task[]> {
    return ApiService.get<Task[]>(`/tasks/team/${teamId}`);
  }

  public async getTaskById(id: string): Promise<Task> {
    return ApiService.get<Task>(`/tasks/${id}`);
  }

  public async createTask(taskData: CreateTaskData): Promise<Task> {
    return ApiService.post<Task, CreateTaskData>("/tasks", taskData);
  }

  public async updateTask(id: string, taskData: UpdateTaskData): Promise<Task> {
    return ApiService.patch<Task, UpdateTaskData>(`/tasks/${id}`, taskData);
  }

  public async updateTaskStatus(
    id: string,
    status: "todo" | "in_progress" | "done",
    completedAt?: string | null
  ): Promise<Task> {
    const updateData: UpdateTaskData = {
      status,
      completedAt:
        status === "done" ? completedAt || new Date().toISOString() : null,
    };
    return this.updateTask(id, updateData);
  }

  public async deleteTask(id: string): Promise<void> {
    return ApiService.delete<void>(`/tasks/${id}`);
  }
}

export default new TaskService();
