<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTeamStore } from "@/stores/teamStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableEmpty,
} from "@/components/ui/table";
import { Loader2, Bell, Check, X } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import ApiService from "@/services/ApiService";
import { toast } from "vue-sonner";
import { Toaster } from "@/components/ui/sonner";

interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  relatedId: string;
  isRead: boolean;
  createdAt: string;
  createdBy: string;
}

const notifications = ref<Notification[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const teamStore = useTeamStore();
const processingNotificationId = ref<string | null>(null);

const fetchNotifications = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await ApiService.get<Notification[]>("/notifications");
    notifications.value = response || [];
  } catch (err: any) {
    console.error("Error fetching notifications:", err);
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const acceptInvite = async (notificationId: string) => {
  processingNotificationId.value = notificationId;

  try {
    await ApiService.post(`/notifications/${notificationId}/accept-invite`);
    toast.success("Team invitation accepted");

    await teamStore.fetchTeams();

    await fetchNotifications();
  } catch (err: any) {
    console.error("Error accepting invite:", err);
    toast.error("Failed to accept invitation");
  } finally {
    processingNotificationId.value = null;
  }
};

const declineInvite = async (notificationId: string) => {
  processingNotificationId.value = notificationId;

  try {
    await ApiService.post(`/notifications/${notificationId}/reject-invite`);
    toast.success("Team invitation declined");

    await fetchNotifications();
  } catch (err: any) {
    console.error("Error declining invite:", err);
    toast.error("Failed to decline invitation");
  } finally {
    processingNotificationId.value = null;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("hr-HR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

onMounted(() => {
  fetchNotifications();
});
</script>

<template>
  <div class="container py-6">
    <Toaster />
    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight">Notifications</h1>
      <p class="text-muted-foreground">
        View and manage your notifications and team invites
      </p>
    </div>

    <div class="rounded-md border">
      <div class="relative">
        <div
          v-if="isLoading"
          class="absolute inset-0 flex items-center justify-center bg-background/80 z-10"
        >
          <Loader2 class="h-8 w-8 animate-spin text-primary" />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[50px]"></TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableEmpty
              v-if="!isLoading && notifications.length === 0"
              :colspan="5"
            >
              <div class="flex flex-col items-center gap-2">
                <Bell class="h-8 w-8 text-muted-foreground" />
                <h3 class="font-medium">No notifications</h3>
                <p class="text-sm text-muted-foreground">
                  You don't have any notifications at the moment.
                </p>
              </div>
            </TableEmpty>
            <TableRow
              v-for="notification in notifications"
              :key="notification.id"
              :class="{ 'bg-muted/50': notification.isRead }"
            >
              <TableCell>
                <div class="flex justify-center">
                  <div
                    class="h-2 w-2 rounded-full"
                    :class="notification.isRead ? 'bg-muted' : 'bg-primary'"
                  ></div>
                </div>
              </TableCell>
              <TableCell class="font-medium">
                {{ notification.message }}
              </TableCell>
              <TableCell>
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="{
                    'bg-primary/10 text-primary':
                      notification.type === 'team_invite',
                    'bg-muted text-muted-foreground':
                      notification.type !== 'team_invite',
                  }"
                >
                  {{ notification.type }}
                </span>
              </TableCell>
              <TableCell>{{ formatDate(notification.createdAt) }}</TableCell>
              <TableCell class="text-right">
                <div class="flex justify-end gap-2">
                  <template v-if="!notification.isRead">
                    <Button
                      v-if="notification.type === 'team_invite'"
                      variant="ghost"
                      size="icon"
                      class="h-8 w-8"
                      :disabled="processingNotificationId === notification.id"
                      @click="acceptInvite(notification.id)"
                    >
                      <Loader2
                        v-if="processingNotificationId === notification.id"
                        class="h-4 w-4 animate-spin text-green-500"
                      />
                      <Check v-else class="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      v-if="notification.type === 'team_invite'"
                      variant="ghost"
                      size="icon"
                      class="h-8 w-8"
                      :disabled="processingNotificationId === notification.id"
                      @click="declineInvite(notification.id)"
                    >
                      <Loader2
                        v-if="processingNotificationId === notification.id"
                        class="h-4 w-4 animate-spin text-destructive"
                      />
                      <X v-else class="h-4 w-4 text-destructive" />
                    </Button>
                  </template>
                  <span
                    v-else-if="notification.type === 'team_invite'"
                    class="text-xs text-muted-foreground"
                  >
                    Already processed
                  </span>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>
