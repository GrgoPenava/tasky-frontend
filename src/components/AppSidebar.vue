<script setup lang="ts">
import type { SidebarProps } from "@/components/ui/sidebar";
import { ref, onMounted, onBeforeUnmount } from "vue";
import NavMain from "./NavMain.vue";
import TeamSwitcher from "./TeamSwitcher.vue";
import NavUser from "./NavUser.vue";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { getCurrentUser, logoutUser, authEventBus } from "@/services/auth";
import { useRouter } from "vue-router";
import { getNavigationItems } from "@/router";
import type { Navigation } from "@/types/navigation";

const router = useRouter();
const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: "icon",
});

const userData = ref({
  name: "",
  email: "",
  avatar: "/avatars/shadcn.jpg",
});

const navItems = ref<Navigation>([]);

const updateUserData = async (user: any) => {
  console.log("Updating user data from event:", user);
  userData.value.name = user?.user_metadata?.name || user?.email || "";
  userData.value.email = user?.email || "";
};

onMounted(async () => {
  try {
    const user = await getCurrentUser();
    if (user) {
      userData.value.name = user.user_metadata?.name || user.email || "";
      userData.value.email = user.email || "";
    }

    navItems.value = getNavigationItems();

    authEventBus.on("login", updateUserData);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
});

onBeforeUnmount(() => {
  authEventBus.off("login", updateUserData);
});

const onUserLogout = async () => {
  console.log("Logout user click");
  try {
    await logoutUser();
    router.push("/login");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <TeamSwitcher />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="navItems" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="userData" @logout-user="onUserLogout" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
