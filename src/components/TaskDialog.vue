<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, UserRound } from "lucide-vue-next";
import type { Task } from "@/models/Task";
import DatePicker from "@/components/ui/date-picker/DatePicker.vue";
import {
  type DateValue,
  parseDate,
  getLocalTimeZone,
} from "@internationalized/date";
import moment from "moment";
import RichTextEditor from "@/components/ui/rich-text-editor/RichTextEditor.vue";
import ApiService from "@/services/ApiService";

interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: string;
  joinedAt: string;
  email: string;
  fullName: string | null;
}

interface TaskFormData {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  teamId: string;
  notes: string;
  assignedTo: string;
}

interface TaskData {
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  priority: number;
  dueDate: string | null;
  teamId: string;
  notes: string | null;
  assignedTo: string | null;
}

interface Props {
  open: boolean;
  isEditMode: boolean;
  isSaving: boolean;
  activeTeamId?: string;
  task?: Task;
}

interface Emits {
  (e: "update:open", value: boolean): void;
  (e: "save", taskData: TaskData): void;
  (e: "cancel"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const teamMembers = ref<TeamMember[]>([]);
const isLoadingMembers = ref(false);

const taskForm = ref<TaskFormData>({
  id: "",
  title: "",
  description: "",
  status: "todo",
  priority: "2",
  dueDate: "",
  teamId: props.activeTeamId || "",
  notes: "",
  assignedTo: "",
});

const dateValue = ref<DateValue | any>(undefined);

const fetchTeamMembers = async (teamId: string) => {
  if (!teamId) return;

  isLoadingMembers.value = true;
  try {
    const response = await ApiService.get<TeamMember[]>(
      `/teams/${teamId}/members`
    );
    console.log("Clanovi tima:", response);

    teamMembers.value = response || [];
  } catch (error) {
    console.error("Error fetching team members:", error);
  } finally {
    isLoadingMembers.value = false;
  }
};

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && props.activeTeamId) {
      fetchTeamMembers(props.activeTeamId);
    }
  }
);

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      taskForm.value = {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description || "",
        status: newTask.status,
        priority: newTask.priority.toString(),
        dueDate: newTask.dueDate || "",
        teamId: newTask.teamId,
        notes: newTask.notes || "",
        assignedTo: newTask.assignedTo || "",
      };

      if (newTask.dueDate) {
        try {
          const date = moment(newTask.dueDate).format("YYYY-MM-DD");
          dateValue.value = parseDate(date);
        } catch (error) {
          console.error("Error parsing date:", error);
          dateValue.value = undefined;
        }
      } else {
        dateValue.value = undefined;
      }

      if (newTask.teamId) {
        fetchTeamMembers(newTask.teamId);
      }
    }
  },
  { immediate: true }
);

watch(dateValue, (newDate) => {
  if (newDate) {
    try {
      const jsDate = newDate.toDate(getLocalTimeZone());
      taskForm.value.dueDate = moment(jsDate).format("YYYY-MM-DD");
    } catch (error) {
      console.error("Error formatting date:", error);
      taskForm.value.dueDate = "";
    }
  } else {
    taskForm.value.dueDate = "";
  }
});

watch(
  () => props.activeTeamId,
  (newId) => {
    if (newId) {
      taskForm.value.teamId = newId;
      fetchTeamMembers(newId);
    }
  }
);

const onSubmit = () => {
  const taskData: TaskData = {
    title: taskForm.value.title,
    description: taskForm.value.description || null,
    status: taskForm.value.status as "todo" | "in_progress" | "done",
    priority: parseInt(taskForm.value.priority),
    dueDate: taskForm.value.dueDate || null,
    teamId: taskForm.value.teamId,
    notes: taskForm.value.notes || null,
    assignedTo:
      taskForm.value.assignedTo === "none" ? null : taskForm.value.assignedTo,
  };

  emit("save", taskData);
};

function closeDialog() {
  emit("update:open", false);
  emit("cancel");
}

function getTeamMember(userId: string) {
  return teamMembers.value.find((member) => member.userId === userId);
}

function getAssignedUserName() {
  if (!taskForm.value.assignedTo) return "Not assigned";

  const member = getTeamMember(taskForm.value.assignedTo);
  return member ? member.fullName || member.email : "Unknown user";
}

onMounted(() => {
  if (props.activeTeamId) {
    fetchTeamMembers(props.activeTeamId);
  }
});
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[70%] max-h-[90vh] overflow-auto">
      <DialogHeader>
        <DialogTitle>{{
          isEditMode ? "Update task details" : "Create a new task"
        }}</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <div class="space-y-1">
          <Label for="title">Title</Label>
          <Input id="title" v-model="taskForm.title" placeholder="Task title" />
        </div>

        <div class="space-y-2">
          <Label for="description">Description</Label>
          <Textarea
            id="description"
            v-model="taskForm.description"
            placeholder="Enter task description"
            class="min-h-[60px]"
          />
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <Label for="notes">Notes</Label>
          </div>
          <div class="h-[380px]">
            <RichTextEditor v-model="taskForm.notes" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4">
          <div class="space-y-1">
            <Label for="status">Status</Label>
            <Select v-model="taskForm.status">
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-1">
            <Label for="priority">Priority</Label>
            <Select v-model="taskForm.priority">
              <SelectTrigger>
                <SelectValue placeholder="Select priority">
                  <div v-if="taskForm.priority" class="flex items-center">
                    <span
                      class="inline-block w-3 h-3 rounded-full mr-2"
                      :class="{
                        'bg-blue-500': taskForm.priority === '1',
                        'bg-green-500': taskForm.priority === '2',
                        'bg-yellow-500': taskForm.priority === '3',
                        'bg-red-500': taskForm.priority === '4',
                      }"
                    ></span>
                    <span>
                      {{
                        taskForm.priority === "1"
                          ? "Low (P1)"
                          : taskForm.priority === "2"
                          ? "Medium (P2)"
                          : taskForm.priority === "3"
                          ? "High (P3)"
                          : taskForm.priority === "4"
                          ? "Critical (P4)"
                          : "Select"
                      }}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  <div class="flex items-center">
                    <span
                      class="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"
                    ></span>
                    <span>Low (P1)</span>
                  </div>
                </SelectItem>
                <SelectItem value="2">
                  <div class="flex items-center">
                    <span
                      class="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"
                    ></span>
                    <span>Medium (P2)</span>
                  </div>
                </SelectItem>
                <SelectItem value="3">
                  <div class="flex items-center">
                    <span
                      class="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"
                    ></span>
                    <span>High (P3)</span>
                  </div>
                </SelectItem>
                <SelectItem value="4">
                  <div class="flex items-center">
                    <span
                      class="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"
                    ></span>
                    <span>Critical (P4)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-1">
            <Label for="dueDate">Due Date</Label>
            <DatePicker v-model="dateValue" />
          </div>

          <div class="space-y-1">
            <Label for="assignedTo">Assigned To</Label>
            <Select v-model="taskForm.assignedTo">
              <SelectTrigger
                :disabled="isLoadingMembers || teamMembers.length === 0"
              >
                <SelectValue
                  :placeholder="isLoadingMembers ? 'Loading...' : 'Assign to'"
                >
                  <div v-if="taskForm.assignedTo" class="flex items-center">
                    <UserRound class="w-4 h-4 mr-2" />
                    <span>{{ getAssignedUserName() }}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <div class="flex items-center">
                    <span>Not assigned</span>
                  </div>
                </SelectItem>
                <SelectItem
                  v-for="member in teamMembers"
                  :key="member.userId"
                  :value="member.userId"
                >
                  <div class="flex items-center">
                    <UserRound class="w-4 h-4 mr-2" />
                    <span>{{ member.fullName || member.email }}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <DialogFooter class="mt-6">
        <Button variant="outline" @click="closeDialog">Cancel</Button>
        <Button :disabled="isSaving" @click="onSubmit">
          <Loader2 v-if="isSaving" class="h-4 w-4 mr-2 animate-spin" />
          {{ isEditMode ? "Update" : "Create" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.dialog-content-expanded {
  height: 90vh;
}
</style>
