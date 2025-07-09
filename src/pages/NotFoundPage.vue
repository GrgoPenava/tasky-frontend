<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 text-center sm:px-6 lg:px-8"
  >
    <div class="space-y-6">
      <h1 class="text-9xl font-extrabold tracking-tight text-gray-900">404</h1>
      <h2 class="text-3xl font-bold text-gray-700">Not Found</h2>
      <p class="text-gray-500">The page you're looking for doesn't exist.</p>
      <div class="mt-8">
        <Button
          @click="goHome"
          class="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Back to Home
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";

const router = useRouter();

const goHome = () => {
  router.push("/");
};
</script>

<style scoped>
.home {
  padding: 20px;
}
</style>
