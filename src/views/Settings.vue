<template>
  <div
    class="container mx-auto flex flex-col justify-center min-h-[calc(100vh-8rem)] py-6 px-4 md:px-6"
  >
    <div v-if="isLoading" class="flex items-center justify-center min-h-[50vh]">
      <div class="flex items-center gap-2">
        <Loader2 class="h-6 w-6 animate-spin" />
        <span class="text-muted-foreground">Loading user data...</span>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-card rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Profile Settings</h2>
        <form @submit.prevent="updateProfile" class="space-y-4">
          <div>
            <label for="fullName" class="block text-sm font-medium mb-1"
              >Full Name</label
            >
            <input
              id="fullName"
              v-model="profileForm.fullName"
              type="text"
              class="w-full rounded-md border border-input px-3 py-2 text-sm"
              placeholder="Enter your full name"
              required
            />
          </div>

          <Button type="submit" :disabled="profileForm.isLoading">
            <span
              v-if="profileForm.isLoading"
              class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            ></span>
            {{ profileForm.isLoading ? "Saving..." : "Update Profile" }}
          </Button>
        </form>
      </div>

      <div class="bg-card rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Password Settings</h2>
        <form @submit.prevent="updatePassword" class="space-y-4">
          <div>
            <label for="currentPassword" class="block text-sm font-medium mb-1"
              >Current Password</label
            >
            <input
              id="currentPassword"
              v-model="passwordForm.currentPassword"
              type="password"
              class="w-full rounded-md border border-input px-3 py-2 text-sm"
              placeholder="Enter your current password"
              required
            />
          </div>
          <div>
            <label for="newPassword" class="block text-sm font-medium mb-1"
              >New Password</label
            >
            <input
              id="newPassword"
              v-model="passwordForm.newPassword"
              type="password"
              class="w-full rounded-md border border-input px-3 py-2 text-sm"
              placeholder="Enter your new password"
              required
            />
          </div>
          <div>
            <label for="confirmPassword" class="block text-sm font-medium mb-1"
              >Confirm New Password</label
            >
            <input
              id="confirmPassword"
              v-model="passwordForm.confirmPassword"
              type="password"
              class="w-full rounded-md border border-input px-3 py-2 text-sm"
              placeholder="Confirm your new password"
              required
            />
          </div>

          <Button type="submit" :disabled="passwordForm.isLoading">
            <span
              v-if="passwordForm.isLoading"
              class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            ></span>
            {{ passwordForm.isLoading ? "Saving..." : "Update Password" }}
          </Button>
        </form>
      </div>
    </div>

    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase/client";
import { authEventBus } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "vue-sonner";
import { Loader2 } from "lucide-vue-next";

const profileForm = ref({
  fullName: "",
  isLoading: false,
});

const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  isLoading: false,
});

const isLoading = ref(true);

onMounted(async () => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user?.user_metadata?.name) {
      profileForm.value.fullName = userData.user.user_metadata.name;
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  } finally {
    isLoading.value = false;
  }
});

const updateProfile = async () => {
  profileForm.value.isLoading = true;

  try {
    if (!profileForm.value.fullName.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      data: { name: profileForm.value.fullName.trim() },
    });

    if (error) {
      throw new Error(error.message);
    }

    toast.success("Profile updated successfully!");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      authEventBus.emit("login", user);
    }
  } catch (error: any) {
    toast.error(
      error.message || "An error occurred while updating your profile"
    );
    console.error("Error updating profile:", error);
  } finally {
    profileForm.value.isLoading = false;
  }
};

const updatePassword = async () => {
  passwordForm.value.isLoading = true;

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toast.error("New passwords do not match");
    passwordForm.value.isLoading = false;
    return;
  }

  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user || !userData.user.email) {
      throw new Error("Could not retrieve user information");
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userData.user.email,
      password: passwordForm.value.currentPassword,
    });

    if (signInError) {
      throw new Error("Current password is incorrect");
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordForm.value.newPassword,
    });

    if (error) {
      throw new Error(error.message);
    }

    toast.success("Password updated successfully!");

    passwordForm.value.currentPassword = "";
    passwordForm.value.newPassword = "";
    passwordForm.value.confirmPassword = "";
  } catch (error: any) {
    toast.error(
      error.message || "An error occurred while updating your password"
    );
    console.error("Error updating password:", error);
  } finally {
    passwordForm.value.isLoading = false;
  }
};
</script>
