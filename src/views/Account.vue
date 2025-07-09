<template>
  <div class="container mx-auto py-6 px-4 md:px-6">
    <h1 class="text-3xl font-bold mb-6">Account</h1>

    <div class="bg-card rounded-lg shadow p-6 mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Profile Information</h2>
        <Button variant="outline" size="sm" @click="goToSettings">
          <Pencil class="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>
      <div class="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div class="flex-shrink-0">
          <div
            class="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold"
          >
            {{ userInitials }}
          </div>
        </div>
        <div class="space-y-4 flex-1">
          <div>
            <h3 class="text-sm font-medium text-muted-foreground">Full Name</h3>
            <p class="text-lg">{{ userData.name || "Not provided" }}</p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-muted-foreground">
              Email Address
            </h3>
            <p class="text-lg">{{ userData.email }}</p>
            <span
              v-if="userData.emailConfirmed"
              class="text-sm text-green-600 flex items-center gap-1 mt-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-check-circle"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Verified
            </span>
            <span
              v-else
              class="text-sm text-yellow-600 flex items-center gap-1 mt-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-alert-circle"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Not verified
            </span>
          </div>
          <div>
            <h3 class="text-sm font-medium text-muted-foreground">
              Account Created
            </h3>
            <p class="text-lg">{{ formattedCreatedAt }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="h-px bg-border my-8"></div>

    <div class="bg-card rounded-lg shadow p-6 mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">User Statistics</h2>
        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            :class="{
              'bg-primary text-primary-foreground hover:bg-primary/90':
                selectedPeriod === 'week',
            }"
            @click="changePeriod('week')"
          >
            Week
          </Button>
          <Button
            variant="outline"
            size="sm"
            :class="{
              'bg-primary text-primary-foreground hover:bg-primary/90':
                selectedPeriod === 'month',
            }"
            @click="changePeriod('month')"
          >
            Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            :class="{
              'bg-primary text-primary-foreground hover:bg-primary/90':
                selectedPeriod === 'year',
            }"
            @click="changePeriod('year')"
          >
            Year
          </Button>
        </div>
      </div>

      <div v-if="isLoadingStats" class="flex justify-center items-center py-12">
        <div
          class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        ></div>
      </div>

      <div
        v-else-if="statsError"
        class="p-4 border border-destructive/50 bg-destructive/10 rounded-lg text-destructive"
      >
        <p>{{ statsError }}</p>
      </div>

      <div v-else-if="userStats">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
        >
          <div class="p-4 border rounded-lg">
            <h3 class="text-sm font-medium text-muted-foreground">
              Tasks Created
            </h3>
            <p class="text-2xl font-semibold">
              {{ userStats.summary.tasksCreated }}
            </p>
          </div>
          <div class="p-4 border rounded-lg">
            <h3 class="text-sm font-medium text-muted-foreground">
              Tasks Assigned
            </h3>
            <p class="text-2xl font-semibold">
              {{ userStats.summary.tasksAssigned }}
            </p>
          </div>
          <div class="p-4 border rounded-lg">
            <h3 class="text-sm font-medium text-muted-foreground">
              Tasks Completed
            </h3>
            <p class="text-2xl font-semibold">
              {{ userStats.summary.tasksCompleted }}
            </p>
          </div>
          <div class="p-4 border rounded-lg">
            <h3 class="text-sm font-medium text-muted-foreground">
              Created in Period
            </h3>
            <p class="text-2xl font-semibold">
              {{ userStats.summary.createdInPeriod }}
            </p>
          </div>
          <div class="p-4 border rounded-lg">
            <h3 class="text-sm font-medium text-muted-foreground">
              Completion Rate
            </h3>
            <p class="text-2xl font-semibold">
              {{ userStats.summary.completionRate }}%
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div class="p-4 border rounded-lg">
            <h3 class="text-lg font-medium mb-4">Task Status Distribution</h3>
            <div class="h-64">
              <Pie :data="statusChartData" :options="pieChartOptions" />
            </div>
          </div>

          <div class="p-4 border rounded-lg">
            <h3 class="text-lg font-medium mb-4">Team Task Distribution</h3>
            <div class="h-64">
              <Pie :data="teamChartData" :options="pieChartOptions" />
            </div>
          </div>
        </div>

        <div class="mt-4 text-sm text-muted-foreground">
          <p>
            Period: {{ formatDate(userStats.period.start) }} -
            {{ formatDate(userStats.period.end) }}
          </p>
        </div>
      </div>

      <div
        v-else
        class="p-4 border rounded-lg text-center text-muted-foreground"
      >
        <p>
          No statistics available. Start creating and completing tasks to see
          your progress!
        </p>
      </div>
    </div>

    <div class="h-px bg-border my-8"></div>

    <div class="bg-card rounded-lg shadow p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Connected Accounts</h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"
            >
              <Mail class="h-5 w-5" />
            </div>
            <div>
              <p class="font-medium">Email Account</p>
              <p class="text-sm text-muted-foreground">{{ userData.email }}</p>
            </div>
          </div>
          <div>
            <span
              class="px-2 py-1 text-xs rounded-full bg-green-50 text-green-700 border border-green-200"
            >
              Primary
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between p-4 border rounded-lg">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"
            >
              <Github class="h-5 w-5" />
            </div>
            <div>
              <p class="font-medium">GitHub Account</p>
              <p
                v-if="connectedAccounts.github"
                class="text-sm text-muted-foreground"
              >
                {{ connectedAccounts.github }}
              </p>
              <p v-else class="text-sm text-muted-foreground">Not connected</p>
            </div>
          </div>
          <div>
            <span
              v-if="connectedAccounts.github"
              class="px-2 py-1 text-xs rounded-full bg-green-50 text-green-700 border border-green-200"
            >
              Connected
            </span>
            <Button v-else variant="outline" size="sm" @click="connectGithub"
              >Connect</Button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { supabase } from "@/supabase/client";
import { Button } from "@/components/ui/button";
import { Pencil, Mail, Github } from "lucide-vue-next";
import { useRouter } from "vue-router";
import StatisticsService from "@/services/StatisticsService";
import type { UserStatistics } from "@/models/Statistics";
import { Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const router = useRouter();

const userData = ref({
  id: "",
  name: "",
  email: "",
  emailConfirmed: false,
  createdAt: "",
  teamsCount: 0,
});

const connectedAccounts = ref({
  github: "",
});

const userStats = ref<UserStatistics | null>(null);
const isLoadingStats = ref(false);
const statsError = ref<string | null>(null);
const selectedPeriod = ref<"week" | "month" | "year">("year");

const pieChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right" as const,
    },
  },
});

const statusChartData = computed(() => {
  if (!userStats.value) return { labels: [], datasets: [] };

  const distribution = userStats.value.charts.statusDistribution;

  return {
    labels: ["To Do", "In Progress", "Done"],
    datasets: [
      {
        data: [distribution.todo, distribution.in_progress, distribution.done],
        backgroundColor: [
          "rgb(244, 193, 65)",
          "rgb(65, 196, 244)",
          "rgb(76, 175, 80)",
        ],
        borderWidth: 1,
        borderColor: ["#fff", "#fff", "#fff"],
      },
    ],
  };
});

const generateColor = (index: number): string => {
  const hue = (index * 137.5) % 360;
  return `hsl(${hue}, 65%, 55%)`;
};

const teamChartData = computed(() => {
  if (!userStats.value) return { labels: [], datasets: [] };

  const distribution = userStats.value.charts.teamTaskDistribution;
  const teams = Object.keys(distribution);
  const values = teams.map((team) => distribution[team]);

  const colors = teams.map((_, index) => generateColor(index));

  return {
    labels: teams,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderWidth: 1,
        borderColor: Array(teams.length).fill("#fff"),
      },
    ],
  };
});

onMounted(async () => {
  await fetchUserData();
  await fetchStats();
  await checkConnectedAccounts();
});

const checkConnectedAccounts = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const githubIdentity = user.identities?.find(
        (identity) => identity.provider === "github"
      );

      if (githubIdentity && githubIdentity.identity_data) {
        connectedAccounts.value.github =
          githubIdentity.identity_data.user_name ||
          githubIdentity.identity_data.email ||
          "GitHub User";
      }
    }
  } catch (error) {
    console.error("Error checking connected accounts:", error);
  }
};

const connectGithub = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/account`,
      },
    });

    if (error) throw error;
  } catch (error) {
    console.error("Error connecting GitHub account:", error);
  }
};

const fetchStats = async () => {
  isLoadingStats.value = true;
  statsError.value = null;

  try {
    userStats.value = await StatisticsService.getUserStatistics(
      selectedPeriod.value
    );
  } catch (error: any) {
    console.error("Error fetching user statistics:", error);
    statsError.value = "Failed to load statistics. Please try again later.";
    userStats.value = null;
  } finally {
    isLoadingStats.value = false;
  }
};

const changePeriod = (period: "week" | "month" | "year") => {
  selectedPeriod.value = period;
  fetchStats();
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const fetchUserData = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      userData.value = {
        id: user.id,
        name: user.user_metadata?.name || "",
        email: user.email || "",
        emailConfirmed: user.email_confirmed_at ? true : false,
        createdAt: user.created_at || "",
        teamsCount: 0,
      };

      const { error: tableCheckError } = await supabase
        .from("team_members")
        .select("id", { count: "exact", head: true })
        .limit(1);

      if (!tableCheckError) {
        const { count } = await supabase
          .from("team_members")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        userData.value.teamsCount = count || 0;
      } else {
        console.log(
          "Team members table might not exist yet:",
          tableCheckError.message
        );
      }
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

const goToSettings = () => {
  router.push("/settings");
};

const userInitials = computed(() => {
  if (userData.value.name) {
    return userData.value.name
      .split(" ")
      .map((name) => name.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);
  }
  return userData.value.email
    ? userData.value.email.charAt(0).toUpperCase()
    : "U";
});

const formattedCreatedAt = computed(() => {
  if (!userData.value.createdAt) return "Unknown";
  return new Date(userData.value.createdAt).toLocaleDateString("hr-HR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});
</script>
