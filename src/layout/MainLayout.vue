<script lang="ts">
export const iframeHeight = "800px";
export const containerClass = "w-full h-full";
export const description = "A sidebar that collapses to icons.";
</script>

<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { computed } from "vue";
import moment from "moment";

const route = useRoute();
const router = useRouter();

const currentDate = computed(() => {
  return moment().format("DD.MM.YYYY");
});

const isBoardPage = computed(() => {
  return route.name === "Board";
});

const breadcrumbs = computed(() => {
  const items = [];

  items.push({
    name: "Home",
    path: "/",
    isActive: route.path === "/",
  });

  if (route.path !== "/") {
    const routeName = route.meta.title || route.name?.toString() || "";
    items.push({
      name: routeName,
      path: route.path,
      isActive: true,
    });
  }

  return items;
});

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header
        class="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      >
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <template v-for="(item, index) in breadcrumbs" :key="index">
                <BreadcrumbSeparator v-if="index > 0" class="hidden md:block" />

                <BreadcrumbItem class="hidden md:block">
                  <BreadcrumbPage v-if="item.isActive">
                    {{ item.name }}
                  </BreadcrumbPage>

                  <BreadcrumbLink
                    v-else
                    @click="navigateTo(item.path)"
                    class="cursor-pointer"
                  >
                    {{ item.name }}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </template>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div v-if="isBoardPage" class="px-4 text-sm text-muted-foreground">
          {{ currentDate }}
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4 pt-0" id="moje-stranice">
        <RouterView />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
