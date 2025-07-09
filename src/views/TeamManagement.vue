<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from "vue";
import { useTeamStore } from "@/stores/teamStore";
import { toast } from "vue-sonner";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableEmpty,
} from "@/components/ui/table";
import { Loader2, UserRound, ShieldCheck, UserPlus } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApiService from "@/services/ApiService";

interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: string;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  fullName: string | null;
}

interface NonTeamMember {
  id: string;
  email: string;
  fullName: string;
}

const teamStore = useTeamStore();
const teamMembers = ref<TeamMember[]>([]);
const nonTeamMembers = ref<NonTeamMember[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const currentUserId = ref<string | null>(null);

const showInviteDialog = ref(false);
const selectedUserId = ref<string>("");
const isInviting = ref(false);

const isRemoving = ref(false);
const memberToRemove = ref<TeamMember | null>(null);

const isCurrentUserOwner = computed(() => {
  return teamStore.activeTeam?.ownerId === currentUserId.value;
});

const fetchCurrentUser = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      currentUserId.value = user.id;
      console.log("Current user ID:", currentUserId.value);
      console.log("Team owner ID:", teamStore.activeTeam?.ownerId);
      console.log(
        "Is owner:",
        currentUserId.value === teamStore.activeTeam?.ownerId
      );
    }
  } catch (error) {
    console.error("Error fetching current user:", error);
  }
};

const fetchTeamMembers = async (teamId: string) => {
  isLoading.value = true;
  error.value = null;
  teamMembers.value = [];

  try {
    const response = await ApiService.get<TeamMember[]>(
      `/teams/${teamId}/members`
    );
    teamMembers.value = response || [];
  } catch (err: any) {
    console.error("Error fetching team members:", err);
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const fetchNonTeamMembers = async (teamId: string) => {
  try {
    const response = await ApiService.get<NonTeamMember[]>(
      `/teams/${teamId}/non-members`
    );
    nonTeamMembers.value = response || [];
  } catch (err: any) {
    console.error("Error fetching non-team members:", err);
    toast.error("Failed to load available users");
  }
};

const inviteUser = async () => {
  if (!teamStore.activeTeam || !selectedUserId.value) return;

  isInviting.value = true;
  try {
    const userToInvite = nonTeamMembers.value.find(
      (user) => user.id === selectedUserId.value
    );
    if (!userToInvite) return;

    await ApiService.post("/teams/invite", {
      teamId: teamStore.activeTeam.id,
      email: userToInvite.email,
    });

    toast.success("Invitation sent successfully");
    showInviteDialog.value = false;
    selectedUserId.value = "";
  } catch (err: any) {
    console.error("Error inviting user:", err);
    toast.error("Failed to send invitation");
  } finally {
    isInviting.value = false;
  }
};

const openInviteDialog = async () => {
  if (!teamStore.activeTeam) return;

  await fetchNonTeamMembers(teamStore.activeTeam.id);
  showInviteDialog.value = true;
};

watchEffect(() => {
  if (teamStore.activeTeam) {
    fetchTeamMembers(teamStore.activeTeam.id);
  }
});

onMounted(async () => {
  await fetchCurrentUser();

  if (!teamStore.activeTeam) {
    await teamStore.fetchTeams();
  }

  if (teamStore.activeTeam) {
    fetchTeamMembers(teamStore.activeTeam.id);
  }
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("hr-HR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const isOwner = (userId: string) => {
  return teamStore.activeTeam?.ownerId === userId;
};

const removeMember = async (member: TeamMember) => {
  if (!teamStore.activeTeam || !isCurrentUserOwner.value) return;

  if (isOwner(member.userId)) {
    toast.error("Cannot remove the team owner");
    return;
  }

  isRemoving.value = true;
  memberToRemove.value = member;

  try {
    await ApiService.delete(
      `/teams/${teamStore.activeTeam.id}/members/${member.userId}`
    );
    toast.success(`${member.fullName || member.email} removed from the team`);

    await fetchTeamMembers(teamStore.activeTeam.id);
  } catch (err: any) {
    console.error("Error removing team member:", err);
    toast.error(err.message || "Failed to remove team member");
  } finally {
    isRemoving.value = false;
    memberToRemove.value = null;
  }
};
</script>

<template>
  <div class="container py-6">
    <Toaster />
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Team Management</h1>
        <p class="text-muted-foreground">
          Manage members of {{ teamStore.activeTeam?.name }} team
        </p>
      </div>
      <Button v-if="isCurrentUserOwner" @click="openInviteDialog">
        <UserPlus class="h-4 w-4 mr-2" />
        Invite Member
      </Button>
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
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableEmpty
              v-if="!isLoading && teamMembers.length === 0"
              :colspan="6"
            >
              <div class="flex flex-col items-center gap-2">
                <UserRound class="h-8 w-8 text-muted-foreground" />
                <h3 class="font-medium">No team members found</h3>
                <p class="text-sm text-muted-foreground">
                  This team doesn't have any members yet.
                </p>
              </div>
            </TableEmpty>
            <TableRow v-for="member in teamMembers" :key="member.id">
              <TableCell>
                <div class="flex justify-center">
                  <ShieldCheck
                    v-if="isOwner(member.userId)"
                    class="h-5 w-5 text-primary"
                  />
                </div>
              </TableCell>
              <TableCell class="font-medium">
                {{ member.fullName || "Unnamed User" }}
              </TableCell>
              <TableCell>{{ member.email }}</TableCell>
              <TableCell>
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="{
                    'bg-primary/10 text-primary': isOwner(member.userId),
                    'bg-muted text-muted-foreground': !isOwner(member.userId),
                  }"
                >
                  {{ isOwner(member.userId) ? "Owner" : "Member" }}
                </span>
              </TableCell>
              <TableCell>{{ formatDate(member.joinedAt) }}</TableCell>
              <TableCell class="text-right">
                <Button
                  v-if="!isOwner(member.userId)"
                  variant="outline"
                  size="sm"
                  :disabled="
                    !isCurrentUserOwner ||
                    (isRemoving && memberToRemove?.id === member.id)
                  "
                  @click="removeMember(member)"
                >
                  <Loader2
                    v-if="isRemoving && memberToRemove?.id === member.id"
                    class="h-3 w-3 mr-1 animate-spin"
                  />
                  {{
                    isRemoving && memberToRemove?.id === member.id
                      ? "Removing..."
                      : "Remove"
                  }}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>

    <Dialog v-model:open="showInviteDialog">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="space-y-2">
            <Select v-model="selectedUserId">
              <SelectTrigger>
                <SelectValue placeholder="Select a user to invite" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="user in nonTeamMembers"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ user.fullName || user.email }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            @click="showInviteDialog = false"
            :disabled="isInviting"
          >
            Cancel
          </Button>
          <Button @click="inviteUser" :disabled="!selectedUserId || isInviting">
            <Loader2 v-if="isInviting" class="mr-2 h-4 w-4 animate-spin" />
            {{ isInviting ? "Sending..." : "Send Invite" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
