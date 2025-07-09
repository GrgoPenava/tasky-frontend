import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import About from "./views/About.vue";
import Register from "./views/Register.vue";
import Login from "./views/Login.vue";
import AuthCallback from "./views/AuthCallback.vue";
import NotFoundPage from "./pages/NotFoundPage.vue";
import MainLayout from "./layout/MainLayout.vue";
import { getCurrentUser } from "./services/auth";
import {
  type LucideIcon,
  BookOpen,
  Home as HomeIcon,
  User,
  ClipboardList,
  Users,
  Bell,
  Settings2 as SettingsIcon,
} from "lucide-vue-next";
import type {
  Navigation,
  NavigationGroup,
  NavigationItem,
} from "./types/navigation";
import Home from "./views/Home.vue";
import Board from "./views/Board.vue";
import TeamManagement from "./views/TeamManagement.vue";
import Settings from "./views/Settings.vue";
import Account from "./views/Account.vue";
import Notifications from "./views/Notifications.vue";

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth: boolean;
    icon?: LucideIcon;
    title?: string;
    isActive?: boolean;
    showInSidebar?: boolean;
    sidebarGroup?: string;
    order?: number;
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      requiresAuth: false,
      showInSidebar: false,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      requiresAuth: false,
      showInSidebar: false,
    },
  },
  {
    path: "/",
    component: MainLayout,
    meta: {
      requiresAuth: true,
      showInSidebar: false,
    },
    children: [
      {
        path: "/",
        name: "Home",
        component: Home,
        meta: {
          requiresAuth: true,
          icon: HomeIcon,
          title: "Home",
          showInSidebar: true,
          isActive: true,
          sidebarGroup: "Platform",
          order: 1,
        },
      },
      {
        path: "/about",
        name: "About",
        component: About,
        meta: {
          requiresAuth: true,
          icon: BookOpen,
          title: "About",
          showInSidebar: true,
          sidebarGroup: "Platform",
          order: 2,
        },
      },
      {
        path: "board",
        name: "Board",
        component: Board,
        meta: {
          requiresAuth: true,
          icon: ClipboardList,
          title: "Board",
          showInSidebar: true,
          sidebarGroup: "Platform",
        },
      },
      {
        path: "team",
        name: "TeamManagement",
        component: TeamManagement,
        meta: {
          requiresAuth: true,
          icon: Users,
          title: "Team Management",
          showInSidebar: true,
          sidebarGroup: "Platform",
        },
      },
      {
        path: "/settings",
        name: "Settings",
        component: Settings,
        meta: {
          requiresAuth: true,
          icon: SettingsIcon,
          title: "Settings",
          showInSidebar: true,
          group: "Platform",
          order: 4,
        },
      },
      {
        path: "/account",
        name: "Account",
        component: Account,
        meta: {
          requiresAuth: true,
          icon: User,
          title: "Account",
          showInSidebar: false,
        },
      },
      {
        path: "/auth/callback",
        name: "AuthCallback",
        component: AuthCallback,
        meta: {
          requiresAuth: false,
          showInSidebar: false,
        },
      },
      {
        path: "/notifications",
        name: "Notifications",
        component: Notifications,
        meta: {
          requiresAuth: true,
          showInSidebar: true,
          group: "Platform",
          icon: Bell,
        },
      },
    ],
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFoundPage,
    meta: {
      requiresAuth: false,
      showInSidebar: false,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const user = await getCurrentUser();

    if (!user) {
      return { name: "Login" };
    }
  }

  return true;
});

export default router;

export function getNavigationItems(): Navigation {
  const sidebarRoutes = routes
    .flatMap((route) => {
      if (route.children) {
        return route.children;
      }
      return route;
    })
    .filter((route) => route.meta?.showInSidebar)
    .sort((a, b) => (a.meta?.order || 99) - (b.meta?.order || 99));

  const groupedRoutes = sidebarRoutes.reduce((groups, route) => {
    const group = route.meta?.sidebarGroup || "Other";
    if (!groups[group]) {
      groups[group] = [];
    }

    const navItem: NavigationItem = {
      title: route.meta?.title || route.name?.toString() || "",
      url: route.path,
      icon: route.meta?.icon,
      isActive: route.meta?.isActive || false,
      items: route.children
        ?.filter((child) => child.meta?.showInSidebar)
        .map((child) => ({
          title: child.meta?.title || child.name?.toString() || "",
          url: `${route.path}/${child.path}`,
        })),
    };

    groups[group].push(navItem);
    return groups;
  }, {} as Record<string, NavigationItem[]>);

  return Object.entries(groupedRoutes).map(
    ([group, items]): NavigationGroup => ({
      group,
      items,
    })
  );
}
