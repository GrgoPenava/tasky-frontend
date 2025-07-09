<template>
  <div class="auth-callback">
    <div class="loader"></div>
    <p>{{ statusMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../supabase/client";
import { authEventBus } from "../services/auth";
import AuthService from "../services/AuthService";

const router = useRouter();
const statusMessage = ref("Dovršavanje prijave, molimo pričekajte...");

onMounted(async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    if (data?.session) {
      statusMessage.value = "Verificiramo vaš korisnički račun...";

      try {
        await AuthService.initializeUser();
        console.log("User initialized successfully");
      } catch (initError: any) {
        console.error("Error initializing user:", initError);
      }

      authEventBus.emit("login", data.session.user);

      statusMessage.value = "Preusmjeravanje na početnu stranicu...";
      router.push("/");
    } else {
      statusMessage.value = "Prijava nije uspjela. Preusmjeravanje...";
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }
  } catch (error) {
    console.error("Error during auth callback:", error);
    statusMessage.value = "Došlo je do greške. Preusmjeravanje...";
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  }
});
</script>

<style scoped>
.auth-callback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  text-align: center;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

p {
  font-size: 18px;
  color: #666;
}
</style>
