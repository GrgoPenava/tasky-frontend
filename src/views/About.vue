<template>
  <div class="container mx-auto px-4 py-8">
    <Toaster />
    <div class="flex flex-col items-center mb-16 text-center">
      <div class="relative mb-8">
        <div
          class="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-3xl opacity-70"
        ></div>
        <div
          class="relative z-10 rounded-full bg-primary/10 p-6 w-28 h-28 flex items-center justify-center"
        >
          <InfoIcon class="h-14 w-14 text-primary" />
        </div>
      </div>
      <h1 class="text-4xl md:text-5xl font-bold mb-4">About Tasky</h1>
      <p class="max-w-2xl text-xl text-muted-foreground">
        An innovative platform designed to streamline task management and
        enhance team collaboration
      </p>
    </div>

    <div class="mb-16">
      <h2 class="text-3xl font-bold mb-6 text-center">Project Overview</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div class="space-y-4">
          <p class="text-lg">
            Tasky was developed to address the challenges of modern teamwork in
            a increasingly remote-first world. Our platform combines intuitive
            task management with powerful collaboration features to help teams
            work more efficiently.
          </p>
          <p class="text-lg">
            Whether you're working solo or as part of a distributed team, Task
            Manager provides the tools you need to stay organized, focused, and
            productive.
          </p>
          <div
            class="bg-primary/5 p-4 rounded-lg border border-primary/10 mt-4"
          >
            <h4 class="font-semibold text-primary mb-2 flex items-center">
              <TargetIcon class="h-5 w-5 mr-2" />
              Our Mission
            </h4>
            <p>
              To simplify task management and empower teams to achieve their
              goals through seamless collaboration and real-time insights.
            </p>
          </div>
        </div>
        <div class="bg-card rounded-lg shadow-lg overflow-hidden">
          <img
            src="/task-illustration.svg"
            alt="Task Management Illustration"
            class="w-full h-auto"
            onerror="this.onerror=null; this.src=''; this.classList.add('bg-primary/10', 'aspect-video', 'flex', 'items-center', 'justify-center'); this.innerHTML='<div class=\'text-primary text-center p-12\'><ClipboardCheck class=\'h-20 w-20 mx-auto mb-4\' /><p>Streamlining teamwork and task management</p></div>';"
          />
        </div>
      </div>
    </div>

    <div class="mb-16">
      <h2 class="text-3xl font-bold mb-10 text-center">Core Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          class="bg-card rounded-lg shadow p-6 border border-border/50 hover:shadow-lg transition-shadow"
        >
          <div
            class="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4"
          >
            <ListChecks class="h-6 w-6 text-primary" />
          </div>
          <h3 class="text-xl font-semibold mb-2">Intuitive Task Board</h3>
          <p class="text-muted-foreground">
            Drag-and-drop interface for managing tasks through their lifecycle,
            with customizable statuses and priorities.
          </p>
        </div>

        <div
          class="bg-card rounded-lg shadow p-6 border border-border/50 hover:shadow-lg transition-shadow"
        >
          <div
            class="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4"
          >
            <Users class="h-6 w-6 text-primary" />
          </div>
          <h3 class="text-xl font-semibold mb-2">Team Management</h3>
          <p class="text-muted-foreground">
            Create and manage teams, assign tasks to team members, and
            collaborate in real-time on shared projects.
          </p>
        </div>

        <div
          class="bg-card rounded-lg shadow p-6 border border-border/50 hover:shadow-lg transition-shadow"
        >
          <div
            class="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4"
          >
            <BarChart3 class="h-6 w-6 text-primary" />
          </div>
          <h3 class="text-xl font-semibold mb-2">Performance Analytics</h3>
          <p class="text-muted-foreground">
            Comprehensive dashboard with visual statistics and insights to track
            progress and optimize workflows.
          </p>
        </div>
      </div>
    </div>

    <div class="mb-16">
      <h2 class="text-3xl font-bold mb-8 text-center">Technology Stack</h2>
      <div class="bg-card rounded-lg shadow overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div
            class="p-6 flex flex-col items-center border-r border-b border-border/30 hover:bg-primary/5 transition-colors"
          >
            <CodeIcon class="h-10 w-10 text-primary mb-3" />
            <h3 class="font-semibold mb-1">Frontend</h3>
            <p class="text-center text-sm text-muted-foreground">
              Vue.js, TypeScript, Tailwind CSS
            </p>
          </div>
          <div
            class="p-6 flex flex-col items-center border-r border-b border-border/30 hover:bg-primary/5 transition-colors"
          >
            <ServerIcon class="h-10 w-10 text-primary mb-3" />
            <h3 class="font-semibold mb-1">Backend</h3>
            <p class="text-center text-sm text-muted-foreground">
              Node.js, Express, Socket.IO
            </p>
          </div>
          <div
            class="p-6 flex flex-col items-center border-r border-b border-border/30 hover:bg-primary/5 transition-colors"
          >
            <DatabaseIcon class="h-10 w-10 text-primary mb-3" />
            <h3 class="font-semibold mb-1">Database</h3>
            <p class="text-center text-sm text-muted-foreground">
              Supabase, PostgreSQL
            </p>
          </div>
          <div
            class="p-6 flex flex-col items-center border-b border-border/30 hover:bg-primary/5 transition-colors"
          >
            <ShieldIcon class="h-10 w-10 text-primary mb-3" />
            <h3 class="font-semibold mb-1">Authentication</h3>
            <p class="text-center text-sm text-muted-foreground">
              Supabase Auth, JWT
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-16">
      <h2 class="text-3xl font-bold mb-8 text-center">Future Roadmap</h2>
      <div class="relative mb-10">
        <div class="absolute left-1/2 -ml-0.5 w-1 h-full bg-primary/20"></div>
        <div class="space-y-16">
          <div class="relative pl-8 md:pl-0">
            <div class="md:flex md:items-center">
              <div
                class="md:w-1/2 md:pr-8 md:text-right space-y-2 mb-4 md:mb-0"
              >
                <div
                  class="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-semibold mb-2"
                >
                  Coming Soon
                </div>
                <h3 class="text-xl font-bold">Mobile Applications</h3>
                <p class="text-muted-foreground">
                  Native iOS and Android apps for on-the-go task management and
                  team collaboration.
                </p>
              </div>
              <div
                class="absolute md:relative left-0 md:left-auto top-0 md:top-auto flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white shadow"
              >
                <SmartphoneIcon class="h-4 w-4" />
                <div
                  class="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping opacity-75"
                ></div>
              </div>
              <div class="md:w-1/2 md:pl-8">
                <div
                  class="bg-card shadow-md rounded-lg p-4 border border-border/50"
                >
                  <ul class="space-y-2">
                    <li class="flex items-start">
                      <CheckCircle2
                        class="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                      />
                      <span>Push notifications for task updates</span>
                    </li>
                    <li class="flex items-start">
                      <CheckCircle2
                        class="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                      />
                      <span>Offline mode with sync capabilities</span>
                    </li>
                    <li class="flex items-start">
                      <CheckCircle2
                        class="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                      />
                      <span>Biometric authentication</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="relative pl-8 md:pl-0">
            <div class="md:flex md:items-center">
              <div
                class="md:w-1/2 md:pr-8 md:text-right space-y-2 mb-4 md:mb-0"
              >
                <div
                  class="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-semibold mb-2"
                >
                  Comming Soon
                </div>
                <h3 class="text-xl font-bold">Advanced Analytics Dashboard</h3>
                <p class="text-muted-foreground">
                  Comprehensive reporting tools with customizable dashboards and
                  exportable reports.
                </p>
              </div>
              <div
                class="absolute md:relative left-0 md:left-auto top-0 md:top-auto flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white shadow"
              >
                <LineChartIcon class="h-4 w-4" />
              </div>
              <div class="md:w-1/2 md:pl-8">
                <div
                  class="bg-card shadow-md rounded-lg p-4 border border-border/50"
                >
                  <ul class="space-y-2">
                    <li class="flex items-start">
                      <CheckCircle2
                        class="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                      />
                      <span>Burndown charts and velocity tracking</span>
                    </li>
                    <li class="flex items-start">
                      <CheckCircle2
                        class="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                      />
                      <span>Customizable reporting periods</span>
                    </li>
                    <li class="flex items-start">
                      <CheckCircle2
                        class="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                      />
                      <span>Performance trends and forecasting</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="relative pl-8 md:pl-0">
            <div class="md:flex md:items-center">
              <div
                class="md:w-1/2 md:pr-8 md:text-right space-y-2 mb-4 md:mb-0"
              >
                <div
                  class="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-semibold mb-2"
                >
                  Comming Soon
                </div>
                <h3 class="text-xl font-bold">AI-Powered Assistance</h3>
                <p class="text-muted-foreground">
                  Intelligent suggestions and automation to improve productivity
                  and task management.
                </p>
              </div>
              <div
                class="absolute md:relative left-0 md:left-auto top-0 md:top-auto flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white shadow"
              >
                <BrainCircuitIcon class="h-4 w-4" />
              </div>
              <div class="md:w-1/2 md:pl-8">
                <div
                  class="bg-card shadow-md rounded-lg p-4 border border-border/50"
                >
                  <ul class="space-y-2">
                    <li class="flex items-start">
                      <CheckCircle2
                        class="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                      />
                      <span>Smart task prioritization</span>
                    </li>
                    <li class="flex items-start">
                      <CheckCircle2
                        class="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                      />
                      <span>Workload balancing recommendations</span>
                    </li>
                    <li class="flex items-start">
                      <CheckCircle2
                        class="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                      />
                      <span>Natural language task creation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center">
        <Button size="lg" class="gap-2" @click="router.push('/board')">
          <RocketIcon class="h-5 w-5" />
          Start Using Task Manager
        </Button>
      </div>
    </div>

    <div class="mb-16">
      <h2 class="text-3xl font-bold mb-8 text-center">The Team</h2>
      <div class="bg-card rounded-lg shadow p-8 text-center">
        <div class="mb-8">
          <div
            class="w-24 h-24 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-4"
          >
            <UserIcon class="h-12 w-12 text-primary" />
          </div>
          <h3 class="text-xl font-bold">Grgo Penava</h3>
          <p class="text-muted-foreground">Developer/Owner</p>
        </div>
        <div class="max-w-2xl mx-auto">
          <p>
            I welcome feedback and suggestions for future improvements. I'm
            always looking for new ideas and ways to improve the project. If you
            have any ideas, please feel free to reach out to me.
          </p>
          <p
            class="text-muted-foreground cursor-pointer"
            v-on:click="copyEmail"
          >
            grgopenava00@gmail.com
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { useRouter } from "vue-router";
import {
  Info as InfoIcon,
  Users,
  BarChart3,
  Code as CodeIcon,
  Server as ServerIcon,
  Database as DatabaseIcon,
  Shield as ShieldIcon,
  Smartphone as SmartphoneIcon,
  CheckCircle2,
  LineChart as LineChartIcon,
  BrainCircuit as BrainCircuitIcon,
  Rocket as RocketIcon,
  User as UserIcon,
  Target as TargetIcon,
  ListChecks,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import { Toaster } from "@/components/ui/sonner";

const router = useRouter();

function copyEmail() {
  navigator.clipboard.writeText("grgopenava00@gmail.com");
  toast.success("Email copied to clipboard");
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container > div {
  animation: fadeIn 0.6s ease-out;
  animation-fill-mode: both;
}

.container > div:nth-child(2) {
  animation-delay: 0.2s;
}

.container > div:nth-child(3) {
  animation-delay: 0.4s;
}

.container > div:nth-child(4) {
  animation-delay: 0.6s;
}

.container > div:nth-child(5) {
  animation-delay: 0.8s;
}
</style>
