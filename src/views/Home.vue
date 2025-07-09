<template>
  <div class="container mx-auto px-4 py-8">
    <div
      class="flex flex-col md:flex-row items-center justify-between gap-12 mb-16"
    >
      <div class="space-y-6 max-w-xl">
        <h1 class="text-4xl md:text-5xl font-bold text-primary">
          Task Management
        </h1>
        <p class="text-xl text-muted-foreground">
          Organize, collaborate, and achieve more with our intuitive task
          management platform.
        </p>
        <div class="flex flex-wrap gap-4">
          <Button size="lg" class="gap-2" @click="createTaskClick">
            <ClipboardList class="h-5 w-5" />
            Create Task
          </Button>
          <Button
            variant="outline"
            size="lg"
            class="gap-2"
            @click="viewTeamsClick"
          >
            <Users class="h-5 w-5" />
            View Teams
          </Button>
        </div>
      </div>
      <div class="relative w-full max-w-md aspect-square">
        <div
          class="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-3xl opacity-70"
        ></div>
        <div class="relative z-10 h-full flex items-center justify-center">
          <img
            src="../../public/task2.svg"
            alt="Task Management"
            class="w-4/5 h-4/5"
            onerror="this.src=''; this.classList.add('bg-primary/10', 'rounded-full', 'p-8'); this.parentNode.innerHTML += '<ClipboardCheck class=\'h-full w-full text-primary\' />'"
          />
        </div>
      </div>
    </div>

    <div class="mb-16">
      <h2 class="text-3xl font-bold mb-10 text-center">Key Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          class="bg-card rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div
            class="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4"
          >
            <CheckSquare class="h-6 w-6 text-primary" />
          </div>
          <h3 class="text-xl font-semibold mb-2">Task Management</h3>
          <p class="text-muted-foreground">
            Create, assign, and track tasks with ease. Set priorities,
            deadlines, and keep everything organized in one place.
          </p>
        </div>

        <div
          class="bg-card rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div
            class="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4"
          >
            <Users class="h-6 w-6 text-primary" />
          </div>
          <h3 class="text-xl font-semibold mb-2">Team Collaboration</h3>
          <p class="text-muted-foreground">
            Work together seamlessly with your team. Share tasks, communicate
            progress, and achieve goals faster through effective collaboration.
          </p>
        </div>

        <div
          class="bg-card rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div
            class="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4"
          >
            <PieChart class="h-6 w-6 text-primary" />
          </div>
          <h3 class="text-xl font-semibold mb-2">Progress Tracking</h3>
          <p class="text-muted-foreground">
            Monitor your productivity and team performance with intuitive
            statistics. Visualize progress and identify areas for improvement.
          </p>
        </div>
      </div>
    </div>

    <div class="mb-16">
      <h2 class="text-3xl font-bold mb-10 text-center">How It Works</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="text-center">
          <div
            class="mx-auto rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mb-4 relative"
          >
            <User class="h-8 w-8 text-primary" />
            <div
              class="absolute -right-2 -top-2 bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white font-bold"
            >
              1
            </div>
          </div>
          <h3 class="text-lg font-semibold mb-2">Create Account</h3>
          <p class="text-sm text-muted-foreground">
            Sign up and set up your personal profile
          </p>
        </div>

        <div class="text-center">
          <div
            class="mx-auto rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mb-4 relative"
          >
            <UsersRound class="h-8 w-8 text-primary" />
            <div
              class="absolute -right-2 -top-2 bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white font-bold"
            >
              2
            </div>
          </div>
          <h3 class="text-lg font-semibold mb-2">Create Team</h3>
          <p class="text-sm text-muted-foreground">
            Form a team or join an existing one
          </p>
        </div>

        <div class="text-center">
          <div
            class="mx-auto rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mb-4 relative"
          >
            <ClipboardList class="h-8 w-8 text-primary" />
            <div
              class="absolute -right-2 -top-2 bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white font-bold"
            >
              3
            </div>
          </div>
          <h3 class="text-lg font-semibold mb-2">Create Tasks</h3>
          <p class="text-sm text-muted-foreground">
            Add and assign tasks to team members
          </p>
        </div>

        <div class="text-center">
          <div
            class="mx-auto rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mb-4 relative"
          >
            <CheckSquare class="h-8 w-8 text-primary" />
            <div
              class="absolute -right-2 -top-2 bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white font-bold"
            >
              4
            </div>
          </div>
          <h3 class="text-lg font-semibold mb-2">Track Progress</h3>
          <p class="text-sm text-muted-foreground">
            Monitor completion and analyze performance
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getCurrentUser } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "vue-router";
import {
  CheckSquare,
  ClipboardList,
  User,
  Users,
  UsersRound,
  PieChart,
} from "lucide-vue-next";

const currentUser = ref<any>(null);
const router = useRouter();
onMounted(async () => {
  await fetchCurrentUser();
});

async function fetchCurrentUser() {
  try {
    const user = await getCurrentUser();
    if (user) {
      currentUser.value = user;
      console.log("User loaded:", user);
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}

function createTaskClick() {
  console.log("Create task clicked");
  router.push("/board");
}

function viewTeamsClick() {
  console.log("View teams clicked");
  router.push("/team");
}
</script>

<style scoped>
.home {
  padding: 20px;
}
</style>
