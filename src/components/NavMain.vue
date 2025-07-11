<script setup lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-vue-next";
import { RouterLink } from "vue-router";
import type { Navigation } from "@/types/navigation";

defineProps<{
  items: Navigation;
}>();
</script>

<template>
  <template v-for="group in items" :key="group.group">
    <SidebarGroup>
      <SidebarGroupLabel>{{ group.group }}</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible
          v-for="item in group.items"
          :key="item.title"
          as-child
          :default-open="item.isActive"
          class="group/collapsible"
        >
          <SidebarMenuItem>
            <template v-if="item.items && item.items.length > 0">
              <CollapsibleTrigger as-child>
                <SidebarMenuButton :tooltip="item.title">
                  <component :is="item.icon" v-if="item.icon" />
                  <span>{{ item.title }}</span>
                  <ChevronRight
                    class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem
                    v-for="subItem in item.items"
                    :key="subItem.title"
                  >
                    <SidebarMenuSubButton as-child>
                      <RouterLink :to="subItem.url">
                        <span>{{ subItem.title }}</span>
                      </RouterLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </template>
            <template v-else>
              <SidebarMenuButton as-child :tooltip="item.title">
                <RouterLink :to="item.url">
                  <component :is="item.icon" v-if="item.icon" />
                  <span>{{ item.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </template>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  </template>
</template>
