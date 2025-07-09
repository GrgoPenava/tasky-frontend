<script setup lang="ts">
import { ref } from "vue";
import TeamService from "@/services/TeamService";
import type { CreateTeamData } from "@/models/Team";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2 } from "lucide-vue-next";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "team-created"): void;
}>();

const teamName = ref("");
const teamDescription = ref("");
const isSubmitting = ref(false);
const error = ref("");

const isFormValid = () => teamName.value.trim().length > 0;

const resetForm = () => {
  teamName.value = "";
  teamDescription.value = "";
  error.value = "";
  isSubmitting.value = false;
};

const closeDialog = () => {
  resetForm();
  emit("update:open", false);
};

const createTeam = async () => {
  if (!isFormValid()) return;

  isSubmitting.value = true;
  error.value = "";

  try {
    const teamData: CreateTeamData = {
      name: teamName.value.trim(),
      description: teamDescription.value.trim() || null,
      isPersonal: false,
    };

    console.log("Kreiranje novog tima:", teamData);

    const team = await TeamService.createTeam(teamData);
    console.log("Team created successfully:", team);

    emit("team-created");

    closeDialog();
  } catch (err) {
    console.error("Unexpected error:", err);
    error.value =
      err instanceof Error ? err.message : "An unexpected error occurred";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <Dialog :open="props.open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create new team</DialogTitle>
        <DialogDescription>
          Add a new team for collaboration. Teams let you organize tasks and
          work together with teammates.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="createTeam" class="space-y-4 py-4">
        <div class="space-y-2">
          <label for="name" class="text-sm font-medium"
            >Team name <span class="text-destructive">*</span></label
          >
          <Input
            id="name"
            v-model="teamName"
            placeholder="Acme Inc."
            :disabled="isSubmitting"
            required
          />
        </div>

        <div class="space-y-2">
          <label for="description" class="text-sm font-medium"
            >Description (optional)</label
          >
          <textarea
            id="description"
            v-model="teamDescription"
            placeholder="Brief description of the team's purpose"
            :disabled="isSubmitting"
            rows="3"
            class="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          ></textarea>
        </div>

        <div v-if="error" class="rounded-md bg-destructive/15 p-3 text-sm">
          <div class="flex items-center gap-2">
            <AlertCircle class="h-4 w-4 text-destructive" />
            <span class="text-destructive">{{ error }}</span>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            @click="closeDialog"
            :disabled="isSubmitting"
          >
            Cancel
          </Button>
          <Button type="submit" :disabled="!isFormValid() || isSubmitting">
            <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            <span>{{ isSubmitting ? "Creating..." : "Create team" }}</span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
