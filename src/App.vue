<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref, onBeforeMount } from "vue";
import { getCurrentUser, authEventBus } from "./services/auth";

const isLoggedIn = ref(false);
const userName = ref("");
const isAuthLoading = ref(true);

onBeforeMount(async () => {
  await checkAuthState();

  isAuthLoading.value = false;

  authEventBus.on("login", async (user: any) => {
    isLoggedIn.value = true;
    userName.value = user?.user_metadata?.name || user?.email || "";
  });

  authEventBus.on("logout", () => {
    isLoggedIn.value = false;
    userName.value = "";
  });
});

const checkAuthState = async () => {
  const user = await getCurrentUser();
  console.log(user);
  isLoggedIn.value = !!user;
  userName.value = user?.user_metadata?.name || user?.email || "";
};
</script>

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

nav {
  display: flex;
  padding: 1rem;
  gap: 1rem;
  background-color: #eaeaea;
}

nav a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

nav a:hover,
nav a.router-link-active {
  background-color: #ddd;
}

main {
  padding: 1rem;
}

.logout-btn {
  background: none;
  border: none;
  color: #333;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #ddd;
}

.auth-status {
  font-size: 0.9rem;
  color: #666;
}

.loading-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  background-color: #eaeaea;
}

.auth-loader {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
