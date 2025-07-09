<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from "vue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-vue-next";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import socketService from "@/services/SocketService";

interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}

interface Props {
  open: boolean;
  taskId?: string | null;
  taskTitle?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:open", open: boolean): void;
}>();

const comments = ref<Comment[]>([]);
const newComment = ref<string>("");
const isLoading = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);
const error = ref<string | null>(null);
const commentsContainer = ref<HTMLDivElement | null>(null);
const isSocketConnected = ref<boolean>(false);
const isConnecting = ref<boolean>(false);
const statusMessage = ref<string>("");

const initSocketConnection = async (): Promise<void> => {
  if (!props.taskId) return;

  isLoading.value = true;
  isConnecting.value = true;
  error.value = null;
  statusMessage.value = "Inicijalizacija socket konekcije...";

  try {
    await socketService.initialize();

    isSocketConnected.value = true;
    statusMessage.value = "Socket povezan, pridruživanje sobi za komentare...";

    await socketService.joinTaskComments(
      props.taskId,
      handleTaskComments,
      handleNewComment
    );

    statusMessage.value = "Veza uspostavljena, primanje komentara uživo.";
  } catch (err: any) {
    console.error("Error connecting to socket:", err);
    error.value = err.message || "Failed to connect to comment service";
    isSocketConnected.value = false;
    statusMessage.value =
      "Greška pri povezivanju: " + (err.message || "Nepoznata greška");
  } finally {
    isLoading.value = false;
    isConnecting.value = false;
  }
};

const handleTaskComments = (taskComments: Comment[]): void => {
  comments.value = taskComments;

  nextTick(() => {
    scrollToBottom();
  });
};

const handleNewComment = (comment: Comment): void => {
  if (!comments.value.some((c) => c.id === comment.id)) {
    comments.value.push(comment);

    nextTick(() => {
      scrollToBottom();
    });
  }
};

const submitComment = async (): Promise<void> => {
  if (!props.taskId || !newComment.value.trim()) return;

  isSubmitting.value = true;
  error.value = null;

  try {
    if (isSocketConnected.value) {
      socketService.addComment(props.taskId, newComment.value.trim());
      newComment.value = "";
    } else {
      throw new Error("Socket connection not available");
    }
  } catch (err: any) {
    console.error("Error submitting comment:", err);
    error.value = err.message || "Failed to submit comment";
  } finally {
    isSubmitting.value = false;
  }
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("hr-HR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const scrollToBottom = (): void => {
  if (commentsContainer.value) {
    commentsContainer.value.scrollTop = commentsContainer.value.scrollHeight;
  }
};

const leaveTaskComments = (): void => {
  if (isSocketConnected.value) {
    socketService.leaveTaskComments();
    isSocketConnected.value = false;
  }
};

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen && props.taskId) {
      await initSocketConnection();

      await nextTick(() => {
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      });
    } else if (!isOpen) {
      leaveTaskComments();
    }
  }
);

watch(
  () => comments.value.length,
  async (newLength) => {
    if (newLength > 0) {
      await nextTick(() => {
        scrollToBottom();
      });
    }
  }
);

watch(
  () => props.taskId,
  async (newTaskId, oldTaskId) => {
    if (props.open && newTaskId && newTaskId !== oldTaskId) {
      leaveTaskComments();

      await initSocketConnection();
    }
  }
);

onMounted(async () => {
  if (props.open && props.taskId) {
    await initSocketConnection();
  }
});

onBeforeUnmount(() => {
  leaveTaskComments();
});
</script>

<template>
  <Dialog v-if="open" :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[600px] max-h-[90vh] flex flex-col">
      <DialogHeader class="flex-shrink-0">
        <DialogTitle>Komentari: {{ taskTitle }}</DialogTitle>
        <DialogDescription>
          Pregledajte i dodajte komentare za ovaj zadatak
          <span v-if="isConnecting" class="text-amber-500 text-xs ml-2">
            (povezivanje...)
          </span>
        </DialogDescription>
      </DialogHeader>

      <div
        ref="commentsContainer"
        class="flex-1 overflow-y-auto py-4 min-h-[200px] max-h-[calc(70vh-200px)]"
      >
        <div
          v-if="isLoading || isConnecting"
          class="flex flex-col items-center justify-center my-8"
        >
          <Loader2 class="h-8 w-8 animate-spin text-primary mb-2" />
          <p class="text-sm text-muted-foreground">{{ statusMessage }}</p>
        </div>

        <div v-else-if="error" class="text-center text-destructive my-8">
          <p>{{ error }}</p>
          <p class="mt-2 text-sm text-muted-foreground">{{ statusMessage }}</p>
          <div class="flex gap-2 justify-center mt-4">
            <Button @click="initSocketConnection" :disabled="isConnecting">
              <Loader2 v-if="isConnecting" class="h-4 w-4 mr-2 animate-spin" />
              Pokušaj ponovno
            </Button>
          </div>
        </div>

        <div v-else-if="comments.length === 0" class="text-center my-8">
          <p class="text-muted-foreground mb-1">
            Nema dostupnih komentara za ovaj zadatak.
          </p>
          <p v-if="isSocketConnected" class="text-xs text-green-600">
            Veza uspostavljena. Komentari će se pojaviti ovdje u stvarnom
            vremenu.
          </p>
        </div>

        <div v-else class="space-y-4 mb-6">
          <div
            v-for="comment in comments"
            :key="comment.id"
            class="p-3 rounded-lg border bg-card"
          >
            <div class="flex items-start gap-3">
              <Avatar>
                <AvatarFallback>
                  {{
                    comment.user.fullName
                      ? comment.user.fullName.charAt(0).toUpperCase()
                      : comment.user.email.charAt(0).toUpperCase()
                  }}
                </AvatarFallback>
              </Avatar>
              <div class="flex-1">
                <div class="flex justify-between items-start mb-1">
                  <p class="font-medium">
                    {{ comment.user.fullName || comment.user.email }}
                  </p>
                  <span class="text-xs text-muted-foreground">
                    {{ formatDate(comment.createdAt) }}
                  </span>
                </div>
                <p class="text-sm whitespace-pre-line">{{ comment.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-shrink-0 border-t pt-4 mt-2">
        <div class="space-y-2">
          <Textarea
            v-model="newComment"
            placeholder="Napiši komentar..."
            rows="3"
            class="w-full"
            :disabled="isSubmitting || !isSocketConnected"
          />
          <div class="flex justify-end">
            <Button
              @click="submitComment"
              :disabled="
                isSubmitting || !newComment.trim() || !isSocketConnected
              "
            >
              <Loader2 v-if="isSubmitting" class="h-4 w-4 mr-2 animate-spin" />
              <Send v-else class="h-4 w-4 mr-2" />
              Dodaj komentar
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.whitespace-pre-line {
  white-space: pre-line;
}

.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #d4d4d8 transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #d4d4d8;
  border-radius: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #a1a1aa;
}
</style>
