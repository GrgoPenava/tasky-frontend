<template>
  <div class="container mx-auto py-6 px-4">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold">{{ activeTeam?.name }} Board</h1>
        <p class="text-muted-foreground">Manage tasks for your team</p>
      </div>
      <Button variant="outline" @click="fetchTasks" :disabled="isLoading">
        <RefreshCw class="size-4 mr-2" :class="{ 'animate-spin': isLoading }" />
        Refresh
      </Button>
    </div>

    <TaskFilters
      :teamMembers="teamMembers"
      @filter-change="handleFilterChange"
    />

    <div
      v-if="!activeTeam"
      class="flex items-center justify-center min-h-[50vh]"
    >
      <div class="text-center">
        <p class="text-muted-foreground">No active team found</p>
        <p class="text-sm">Please select a team from the sidebar</p>
      </div>
    </div>

    <div
      v-else-if="isLoading && allTasks.length === 0"
      class="flex items-center justify-center min-h-[50vh]"
    >
      <div class="text-center">
        <Loader2 class="size-10 text-primary animate-spin mx-auto mb-4" />
        <p>Loading tasks...</p>
      </div>
    </div>

    <div v-else-if="error" class="text-center">
      <p class="text-red-500">{{ error }}</p>
      <Button class="mt-4" @click="fetchTasks">Try Again</Button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-background rounded-lg border shadow-sm">
        <div class="p-4 border-b">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="font-semibold text-lg">Todo</h2>
              <p class="text-sm text-muted-foreground">
                {{ todoTasks.length }} task(s)
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              class="h-8 w-8 p-0"
              @click="openNewTaskDialog('todo')"
            >
              <PlusIcon class="h-4 w-4" />
            </Button>
          </div>
        </div>

        <draggable
          :list="todoTasks"
          group="tasks"
          item-key="id"
          class="min-h-80 p-4"
          ghost-class="opacity-40"
          :animation="200"
          handle=".task-card"
          id="todo"
          @change="onDragChange"
        >
          <template #item="{ element: task }">
            <div
              class="task-card bg-background rounded-md border p-4 mb-3 cursor-move"
            >
              <div class="flex justify-between items-start mb-2">
                <Badge :class="getPriorityClass(task.priority)" class="text-xs">
                  {{ getPriorityName(task.priority) }}
                </Badge>
                <div class="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-7 w-7 p-0"
                    @click="editTask(task)"
                    title="Edit task"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-7 w-7 p-0"
                    @click="viewTaskHistory(task)"
                    title="View history"
                  >
                    <History class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-7 w-7 p-0"
                    @click="handleShowComments(task)"
                    title="View comments"
                  >
                    <MessageSquare class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    @click="deleteTask(task)"
                    title="Delete task"
                  >
                    <Trash2 class="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <h3 class="font-medium mb-2">{{ task.title }}</h3>
              <p
                v-if="task.description"
                class="text-sm text-muted-foreground mb-2 line-clamp-2"
              >
                {{ task.description }}
              </p>
              <div class="flex flex-col gap-1 mt-3">
                <div
                  v-if="task.assignedTo"
                  class="flex items-center text-xs text-muted-foreground"
                >
                  <UserRound class="h-3 w-3 mr-1" />
                  <span>{{ getAssignedUserName(task.assignedTo) }}</span>
                </div>
                <div class="text-xs text-muted-foreground">
                  Due date: {{ formatDate(task.dueDate) }}
                </div>
                <div class="text-xs text-muted-foreground">
                  Created: {{ formatDate(task.createdAt) }}
                </div>
              </div>
            </div>
          </template>

          <template #footer>
            <Button
              variant="ghost"
              class="w-full justify-start text-muted-foreground hover:text-foreground mt-2"
              @click="openNewTaskDialog('todo')"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Add task
            </Button>
          </template>
        </draggable>
      </div>

      <div class="bg-background rounded-lg border shadow-sm">
        <div class="p-4 border-b">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="font-semibold text-lg">In Progress</h2>
              <p class="text-sm text-muted-foreground">
                {{ inProgressTasks.length }} task(s)
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              class="h-8 w-8 p-0"
              @click="openNewTaskDialog('in_progress')"
            >
              <PlusIcon class="h-4 w-4" />
            </Button>
          </div>
        </div>

        <draggable
          :list="inProgressTasks"
          group="tasks"
          item-key="id"
          class="min-h-80 p-4"
          ghost-class="opacity-40"
          :animation="200"
          handle=".task-card"
          id="in_progress"
          @change="onDragChange"
        >
          <template #item="{ element: task }">
            <div
              class="task-card bg-background rounded-md border p-4 mb-3 cursor-move"
            >
              <div class="flex justify-between items-start mb-2">
                <Badge :class="getPriorityClass(task.priority)" class="text-xs">
                  {{ getPriorityName(task.priority) }}
                </Badge>
                <div class="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-7 w-7 p-0"
                    @click="editTask(task)"
                    title="Edit task"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-7 w-7 p-0"
                    @click="viewTaskHistory(task)"
                    title="View history"
                  >
                    <History class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-7 w-7 p-0"
                    @click="handleShowComments(task)"
                    title="View comments"
                  >
                    <MessageSquare class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    @click="deleteTask(task)"
                    title="Delete task"
                  >
                    <Trash2 class="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <h3 class="font-medium mb-2">{{ task.title }}</h3>
              <p
                v-if="task.description"
                class="text-sm text-muted-foreground mb-2 line-clamp-2"
              >
                {{ task.description }}
              </p>
              <div class="flex flex-col gap-1 mt-3">
                <div
                  v-if="task.assignedTo"
                  class="flex items-center text-xs text-muted-foreground"
                >
                  <UserRound class="h-3 w-3 mr-1" />
                  <span>{{ getAssignedUserName(task.assignedTo) }}</span>
                </div>
                <div class="text-xs text-muted-foreground">
                  Due date: {{ formatDate(task.dueDate) }}
                </div>
                <div class="text-xs text-muted-foreground">
                  Created: {{ formatDate(task.createdAt) }}
                </div>
              </div>
            </div>
          </template>

          <template #footer>
            <Button
              variant="ghost"
              class="w-full justify-start text-muted-foreground hover:text-foreground mt-2"
              @click="openNewTaskDialog('in_progress')"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Add task
            </Button>
          </template>
        </draggable>
      </div>

      <div class="bg-background rounded-lg border shadow-sm">
        <div class="p-4 border-b">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="font-semibold text-lg">Done</h2>
              <p class="text-sm text-muted-foreground">
                {{ doneTasks.length }} task(s)
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              class="h-8 w-8 p-0"
              @click="openNewTaskDialog('done')"
            >
              <PlusIcon class="h-4 w-4" />
            </Button>
          </div>
        </div>

        <draggable
          :list="doneTasks"
          group="tasks"
          item-key="id"
          class="min-h-80 p-4"
          ghost-class="opacity-40"
          :animation="200"
          handle=".task-card"
          id="done"
          @change="onDragChange"
        >
          <template #item="{ element: task }">
            <div
              class="task-card bg-background rounded-md border p-4 mb-3 cursor-move opacity-70"
            >
              <div class="flex justify-between items-start mb-2">
                <Badge :class="getPriorityClass(task.priority)" class="text-xs">
                  {{ getPriorityName(task.priority) }}
                </Badge>
                <div class="flex gap-1">
                  <p
                    v-if="task.completedAt"
                    class="text-xs text-muted-foreground"
                  >
                    Completed: {{ formatDate(task.completedAt) }}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-7 w-7 p-0"
                    @click="editTask(task)"
                    title="Edit task"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-7 w-7 p-0"
                    @click="viewTaskHistory(task)"
                    title="View history"
                  >
                    <History class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-7 w-7 p-0"
                    @click="handleShowComments(task)"
                    title="View comments"
                  >
                    <MessageSquare class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    @click="deleteTask(task)"
                    title="Delete task"
                  >
                    <Trash2 class="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <h3 class="font-medium mb-2 line-through opacity-70">
                {{ task.title }}
              </h3>
              <p
                v-if="task.description"
                class="text-sm text-muted-foreground mb-2 line-clamp-2 opacity-70"
              >
                {{ task.description }}
              </p>
              <div class="flex flex-col gap-1 mt-3">
                <div
                  v-if="task.assignedTo"
                  class="flex items-center text-xs text-muted-foreground"
                >
                  <UserRound class="h-3 w-3 mr-1" />
                  <span>{{ getAssignedUserName(task.assignedTo) }}</span>
                </div>
                <div class="text-xs text-muted-foreground">
                  Due date: {{ formatDate(task.dueDate) }}
                </div>
                <div class="text-xs text-muted-foreground">
                  Created: {{ formatDate(task.createdAt) }}
                </div>
              </div>
            </div>
          </template>

          <template #footer>
            <Button
              variant="ghost"
              class="w-full justify-start text-muted-foreground hover:text-foreground mt-2"
              @click="openNewTaskDialog('done')"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Add task
            </Button>
          </template>
        </draggable>
      </div>
    </div>

    <TaskDialog
      v-model:open="isTaskDialogOpen"
      :is-edit-mode="isEditMode"
      :is-saving="isSaving"
      :active-team-id="activeTeam?.id"
      :task="currentTask"
      @save="handleSaveTask"
      @cancel="handleDialogCancel"
    />

    <AlertDialog v-model:open="isDeleteDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the task
            "{{ taskToDelete?.title }}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            class="bg-destructive text-shadow-white hover:bg-destructive/90"
            @click="handleDeleteConfirm"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <TaskHistoryDialog
      v-model:open="historyDialogOpen"
      :task-id="currentHistoryTask?.id"
      :task-title="currentHistoryTask?.title"
      @update:open="handleHistoryDialogClose"
    />

    <TaskCommentDialog
      v-model:open="commentDialogOpen"
      :task-id="currentCommentTask?.id || null"
      :task-title="currentCommentTask?.title || ''"
      @update:open="handleCommentDialogClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from "vue";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  PlusIcon,
  PencilIcon,
  Loader2,
  Trash2,
  UserRound,
  History,
  MessageSquare,
} from "lucide-vue-next";
import draggable from "vue3-draggable-next";
import TaskService from "@/services/TaskService";
import type { Task } from "@/models/Task";
import { useTeamStore } from "@/stores/teamStore";
import TaskDialog from "@/components/TaskDialog.vue";
import { authEventBus } from "@/services/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ApiService from "@/services/ApiService";
import TaskFilters from "@/components/TaskFilters.vue";
import TaskHistoryDialog from "@/components/TaskHistoryDialog.vue";
import TaskCommentDialog from "@/components/TaskCommentDialog.vue";

interface Team {
  id: string;
  name: string;
}

const activeTeam = ref<Team | null>(null);
const allTasks = ref<Task[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const isTaskDialogOpen = ref(false);
const isSaving = ref(false);
const isEditMode = ref(false);
const currentTask = ref<Task | undefined>(undefined);
const isDeleteDialogOpen = ref(false);
const taskToDelete = ref<Task | null>(null);
const teamStore = useTeamStore();
const teamMembers = ref<any[]>([]);

const currentHistoryTask = ref<Task | null>(null);
const historyDialogOpen = ref(false);

const currentCommentTask = ref<Task | null>(null);
const commentDialogOpen = ref(false);

const activeFilters = ref<{
  assignedTo: string | null;
  startDate: string | null;
  endDate: string | null;
  priority: number | null | string;
  sortBy: "dueDate" | "createdAt" | "priority" | null;
  sortDirection: "asc" | "desc";
}>({
  assignedTo: null,
  startDate: null,
  endDate: null,
  priority: null,
  sortBy: null,
  sortDirection: "desc",
});

const filteredTasks = computed(() => {
  let filtered = [...allTasks.value];

  if (activeFilters.value.assignedTo) {
    if (activeFilters.value.assignedTo === "none") {
      filtered = filtered.filter((task) => !task.assignedTo);
    } else {
      filtered = filtered.filter(
        (task) => task.assignedTo === activeFilters.value.assignedTo
      );
    }
  }

  if (activeFilters.value.startDate && activeFilters.value.startDate !== null) {
    filtered = filtered.filter(
      (task) => task.dueDate && task.dueDate >= activeFilters.value.startDate!
    );
  }

  if (activeFilters.value.endDate && activeFilters.value.endDate !== null) {
    filtered = filtered.filter(
      (task) => task.dueDate && task.dueDate <= activeFilters.value.endDate!
    );
  }

  if (activeFilters.value.priority !== null) {
    const priority =
      typeof activeFilters.value.priority === "string"
        ? parseInt(activeFilters.value.priority)
        : activeFilters.value.priority;

    filtered = filtered.filter((task) => task.priority === priority);
  }

  if (activeFilters.value.sortBy) {
    const sortField = activeFilters.value.sortBy;
    const sortDir = activeFilters.value.sortDirection;

    filtered.sort((a, b) => {
      let valA =
        sortField === "dueDate"
          ? a.dueDate
          : sortField === "createdAt"
          ? a.createdAt
          : sortField === "priority"
          ? a.priority
          : null;

      let valB =
        sortField === "dueDate"
          ? b.dueDate
          : sortField === "createdAt"
          ? b.createdAt
          : sortField === "priority"
          ? b.priority
          : null;

      if (sortField === "dueDate" || sortField === "createdAt") {
        valA = valA ? new Date(valA).getTime() : 0;
        valB = valB ? new Date(valB).getTime() : 0;
      }

      if (sortField === "priority" && sortDir === "desc") {
        return (valB as number) - (valA as number);
      }

      if (sortDir === "asc") {
        return valA! < valB! ? -1 : valA! > valB! ? 1 : 0;
      } else {
        return valA! > valB! ? -1 : valA! < valB! ? 1 : 0;
      }
    });
  }

  return filtered;
});

const todoTasks = computed(() =>
  filteredTasks.value.filter((task) => task.status === "todo")
);

const inProgressTasks = computed(() =>
  filteredTasks.value.filter((task) => task.status === "in_progress")
);

const doneTasks = computed(() =>
  filteredTasks.value.filter((task) => task.status === "done")
);

watch(
  () => activeTeam.value,
  (team) => {
    if (team) {
      fetchTasks();
    }
  },
  { immediate: true }
);

const handleTeamChange = async () => {
  console.log("Team changed, refreshing tasks...");
  await fetchCurrentTeam();
  await fetchTasks();
};

onMounted(async () => {
  await fetchCurrentTeam();
  await fetchTasks();

  authEventBus.on("teamChanged", handleTeamChange);
});

onBeforeUnmount(() => {
  authEventBus.off("teamChanged", handleTeamChange);
});

async function fetchCurrentTeam() {
  try {
    if (!teamStore.activeTeam) {
      await teamStore.fetchTeams();
    }

    if (teamStore.activeTeam) {
      activeTeam.value = {
        id: teamStore.activeTeam.id,
        name: teamStore.activeTeam.name,
      };
    } else {
      throw new Error("No active team found");
    }
  } catch (err: any) {
    console.error("Error fetching current team:", err);
    error.value = err.message;
  }
}

async function fetchTasks() {
  if (!activeTeam.value) return;

  isLoading.value = true;
  error.value = null;

  try {
    const tasks = await TaskService.getTasksByTeam(activeTeam.value.id);
    allTasks.value = tasks;

    await fetchTeamMembers();
  } catch (err: any) {
    console.error("Error fetching tasks:", err);
    error.value = err.message || "Failed to load tasks";
  } finally {
    isLoading.value = false;
  }
}

async function onDragChange(event: any) {
  console.log("Drag event:", JSON.stringify(event, null, 2));

  try {
    if (event.added) {
      const task = event.added.element;
      if (!task || !task.id) return;

      console.log("Task added to a list:", task.id);

      let newStatus: string;

      if (todoTasks.value.find((t) => t.id === task.id)) {
        newStatus = "todo";
        console.log(`Task ${task.id} is now in todoTasks array`);
      } else if (inProgressTasks.value.find((t) => t.id === task.id)) {
        newStatus = "in_progress";
        console.log(`Task ${task.id} is now in inProgressTasks array`);
      } else if (doneTasks.value.find((t) => t.id === task.id)) {
        newStatus = "done";
        console.log(`Task ${task.id} is now in doneTasks array`);
      } else {
        console.warn(
          `Task ${task.id} not found in any array, using original status:`,
          task.status
        );
        newStatus = task.status;
      }

      if (newStatus !== task.status) {
        console.log(`Updating task status from ${task.status} to ${newStatus}`);
        await updateTaskStatus(task.id, newStatus);
      } else {
        console.log(`No status change needed for task ${task.id}`);
      }
    }
  } catch (error) {
    console.error("Error in drag and drop handling:", error);
    fetchTasks();
  }
}

async function updateTaskStatus(taskId: string, newStatus: string) {
  try {
    const taskToUpdate = allTasks.value.find((t) => t.id === taskId);
    if (!taskToUpdate) return;

    const oldStatus = taskToUpdate.status;
    taskToUpdate.status = newStatus as any;

    const completedAt = newStatus === "done" ? new Date().toISOString() : null;

    if (newStatus === "done" && !taskToUpdate.completedAt) {
      taskToUpdate.completedAt = completedAt;
    } else if (newStatus !== "done") {
      taskToUpdate.completedAt = null;
    }

    try {
      await TaskService.updateTaskStatus(taskId, newStatus as any, completedAt);
    } catch (error) {
      taskToUpdate.status = oldStatus;
      taskToUpdate.completedAt =
        oldStatus === "done" ? taskToUpdate.completedAt : null;
      throw error;
    }
  } catch (err: any) {
    console.error("Error updating task status:", err);
    fetchTasks();
  }
}

function openNewTaskDialog(status: string) {
  isEditMode.value = false;
  currentTask.value = undefined;

  currentTask.value = {
    id: "",
    title: "",
    description: null,
    status: status as any,
    notes: "",
    priority: 2,
    dueDate: null,
    teamId: activeTeam.value?.id || "",
    assignedTo: null,
    createdBy: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
  };

  isTaskDialogOpen.value = true;
}

function editTask(task: Task) {
  isEditMode.value = true;
  currentTask.value = task;
  isTaskDialogOpen.value = true;
}

async function handleSaveTask(formData: any) {
  isSaving.value = true;

  try {
    const taskData = {
      title: formData.title,
      description: formData.description || null,
      status: formData.status as "todo" | "in_progress" | "done",
      priority: parseInt(formData.priority),
      dueDate: formData.dueDate || null,
      teamId: activeTeam.value?.id || "",
      notes: formData.notes || null,
      assignedTo: formData.assignedTo || null,
    };

    let updatedTask;

    if (isEditMode.value && currentTask.value?.id) {
      const taskId = currentTask.value.id;
      updatedTask = await TaskService.updateTask(taskId, taskData);

      const index = allTasks.value.findIndex((t) => t.id === taskId);
      if (index !== -1) {
        allTasks.value[index] = updatedTask;
      }
    } else {
      updatedTask = await TaskService.createTask(taskData);
      allTasks.value.push(updatedTask);
    }

    await fetchTasks();
    isTaskDialogOpen.value = false;
  } catch (err: any) {
    console.error("Error saving task:", err);
    alert(err.message || "Failed to save task");
  } finally {
    isSaving.value = false;
  }
}

function handleDialogCancel() {
  currentTask.value = undefined;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getPriorityClass(priority: number): string {
  switch (priority) {
    case 1:
      return "bg-blue-100 text-blue-800";
    case 2:
      return "bg-green-100 text-green-800";
    case 3:
      return "bg-yellow-100 text-yellow-800";
    case 4:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getPriorityName(priority: number): string {
  switch (priority) {
    case 1:
      return "Low";
    case 2:
      return "Medium";
    case 3:
      return "High";
    case 4:
      return "Critical";
    default:
      return "Unknown";
  }
}

async function deleteTask(task: Task) {
  taskToDelete.value = task;
  isDeleteDialogOpen.value = true;
}

async function handleDeleteConfirm() {
  if (!taskToDelete.value) return;

  try {
    await TaskService.deleteTask(taskToDelete.value.id);
    allTasks.value = allTasks.value.filter(
      (t) => t.id !== taskToDelete.value?.id
    );
    isDeleteDialogOpen.value = false;
    taskToDelete.value = null;
  } catch (err: any) {
    console.error("Error deleting task:", err);
    alert(err.message || "Failed to delete task");
  }
}

async function fetchTeamMembers() {
  if (!activeTeam.value?.id) return;

  try {
    const response = await ApiService.get(
      `/teams/${activeTeam.value.id}/members`
    );
    teamMembers.value = response || [];
  } catch (error) {
    console.error("Error fetching team members:", error);
  }
}

function getAssignedUserName(userId: string | null) {
  if (!userId) return null;

  const member = teamMembers.value.find((m) => m.userId === userId);
  return member ? member.fullName || member.email : null;
}

function handleFilterChange(filters: {
  assignedTo: string | null;
  startDate: string | null;
  endDate: string | null;
  priority: number | null | string;
  sortBy: "dueDate" | "createdAt" | "priority" | null;
  sortDirection: "asc" | "desc";
}) {
  activeFilters.value = filters;
}

function viewTaskHistory(task: Task) {
  currentHistoryTask.value = task;
  historyDialogOpen.value = true;
}

function handleHistoryDialogClose() {
  historyDialogOpen.value = false;
  currentHistoryTask.value = null;
}

function handleShowComments(task: Task) {
  currentCommentTask.value = task;
  commentDialogOpen.value = true;
}

function handleCommentDialogClose() {
  commentDialogOpen.value = false;
  currentCommentTask.value = null;
}
</script>
