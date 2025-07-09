import type { LucideIcon } from "lucide-vue-next";

export interface NavigationSubItem {
  title: string;
  url: string;
}

export interface NavigationItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavigationSubItem[];
}

export interface NavigationGroup {
  group: string;
  items: NavigationItem[];
}

export type Navigation = NavigationGroup[];
