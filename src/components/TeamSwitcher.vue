<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronsUpDown, Plus, Users, User } from "lucide-vue-next";
import Skeleton from "./ui/skeleton/Skeleton.vue";
import { onMounted, ref, watch } from "vue";
import CreateTeamDialog from "./CreateTeamDialog.vue";
import { useTeamStore } from "@/stores/teamStore";
import type { Team } from "@/models/Team";
import { authEventBus } from "@/services/auth";

const { isMobile } = useSidebar();
const teamStore = useTeamStore();
const isCreateTeamDialogOpen = ref(false);

const createNewTeam = () => {
  isCreateTeamDialogOpen.value = true;
};

const handleTeamCreated = async () => {
  console.log("Team created, refreshing teams...");
  await teamStore.fetchTeams();
};

const switchTeam = (team: Team) => {
  teamStore.setActiveTeam(team);
};

watch(
  () => teamStore.activeTeam,
  (newTeam) => {
    if (newTeam) {
      authEventBus.emit("teamChanged", { team: newTeam as Team });
    }
  }
);

onMounted(async () => {
  await teamStore.fetchTeams();
});
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div
              v-if="teamStore.activeTeam"
              class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
            >
              <User v-if="teamStore.activeTeam.isPersonal" class="size-4" />
              <Users v-else class="size-4" />
            </div>
            <div
              v-if="teamStore.activeTeam"
              class="grid flex-1 text-left text-sm leading-tight"
            >
              <span class="truncate font-semibold">
                {{ teamStore.activeTeam.name }}
              </span>
              <span class="truncate text-xs">
                {{ teamStore.activeTeam.isPersonal ? "Personal" : "Team" }}
              </span>
            </div>
            <div v-else class="grid flex-1 text-left text-sm leading-tight">
              <Skeleton class="h-4 w-24 mb-1" />
              <Skeleton class="h-3 w-16" />
            </div>
            <ChevronsUpDown class="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          align="start"
          :side="isMobile ? 'bottom' : 'right'"
          :side-offset="4"
        >
          <DropdownMenuLabel class="text-xs text-muted-foreground">
            Teams
          </DropdownMenuLabel>
          <div v-if="teamStore.isLoading" class="py-3 px-4 space-y-2">
            <div class="flex items-center gap-2">
              <Skeleton class="h-6 w-6 rounded-sm" />
              <Skeleton class="h-4 w-24" />
            </div>
            <div class="flex items-center gap-2">
              <Skeleton class="h-6 w-6 rounded-sm" />
              <Skeleton class="h-4 w-32" />
            </div>
            <div class="flex items-center gap-2">
              <Skeleton class="h-6 w-6 rounded-sm" />
              <Skeleton class="h-4 w-28" />
            </div>
          </div>
          <div
            v-else-if="teamStore.teams.length === 0"
            class="py-2 px-4 text-sm"
          >
            No teams found
          </div>
          <template v-else>
            <DropdownMenuItem
              v-for="team in teamStore.teams"
              :key="team.id"
              class="gap-2 p-2"
              @click="switchTeam(team)"
            >
              <div
                class="flex size-6 items-center justify-center rounded-sm border"
              >
                <User v-if="team.isPersonal" class="size-4 shrink-0" />
                <Users v-else class="size-4 shrink-0" />
              </div>
              {{ team.name }}
              <span
                v-if="team.id === teamStore.activeTeam?.id"
                class="ml-auto text-xs"
                >Active</span
              >
            </DropdownMenuItem>
          </template>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="gap-2 p-2" @click="createNewTeam">
            <div
              class="flex size-6 items-center justify-center rounded-md border bg-background"
            >
              <Plus class="size-4" />
            </div>
            <div class="font-medium text-muted-foreground">Create new team</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>

  <CreateTeamDialog
    v-model:open="isCreateTeamDialogOpen"
    @team-created="handleTeamCreated"
  />
</template>
