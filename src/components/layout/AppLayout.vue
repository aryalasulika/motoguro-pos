<script setup>
import { RouterLink, useRoute } from "vue-router";
import {
  LayoutDashboard,
  Wallet,
  Banknote,
  History,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-vue-next";
import { ref } from "vue";
import { useAuthStore } from "../../stores/authStore";
import { useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const isMobileMenuOpen = ref(false);

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "POS", href: "/pos", icon: Wallet },
  { name: "Expenses", href: "/expenses", icon: Banknote },
  { name: "History", href: "/history", icon: History },
  { name: "Settings", href: "/settings", icon: Settings },
];

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function handleLogout() {
  authStore.logout();
  router.push("/login");
}
</script>

<template>
  <div class="min-h-screen flex bg-background text-text">
    <!-- Desktop Sidebar -->
    <aside
      class="hidden md:flex flex-col w-64 border-r border-border bg-surface fixed h-full z-10"
    >
      <div class="h-16 flex items-center px-6 border-b border-border">
        <h1
          class="text-xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent"
        >
          MOTO<span class="text-white">GURO</span>
        </h1>
      </div>

      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
          :class="
            route.path === item.href
              ? 'bg-primary/10 text-primary'
              : 'text-text-muted hover:bg-zinc-800 hover:text-white'
          "
        >
          <component :is="item.icon" size="20" />
          {{ item.name }}
        </RouterLink>

        <!-- Logout Button Desktop -->
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors mt-auto"
        >
          <LogOut size="20" />
          Logout
        </button>
      </nav>
    </aside>

    <!-- Mobile Header -->
    <div
      class="md:hidden fixed top-0 w-full z-20 bg-surface border-b border-border h-16 flex items-center justify-between px-4"
    >
      <h1
        class="text-xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent"
      >
        MOTO<span class="text-white">GURO</span>
      </h1>
      <button
        @click="toggleMobileMenu"
        class="text-text-muted hover:text-white"
      >
        <Menu v-if="!isMobileMenuOpen" size="24" />
        <X v-else size="24" />
      </button>
    </div>

    <!-- Mobile Menu Overlay -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden fixed inset-0 z-10 bg-background/95 backdrop-blur-sm pt-20 px-4"
    >
      <nav class="space-y-2">
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          @click="isMobileMenuOpen = false"
          class="flex items-center gap-3 px-4 py-4 rounded-lg text-lg font-medium transition-colors border border-transparent"
          :class="
            route.path === item.href
              ? 'bg-primary/10 text-primary border-primary/20'
              : 'text-text-muted hover:bg-zinc-800 hover:text-white'
          "
        >
          <component :is="item.icon" size="24" />
          {{ item.name }}
        </RouterLink>

        <!-- Logout Button Mobile -->
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-4 py-4 rounded-lg text-lg font-medium text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size="24" />
          Logout
        </button>
      </nav>
    </div>

    <!-- Main Content -->
    <main class="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 overflow-x-hidden">
      <slot />
    </main>
  </div>
</template>
