<script setup>
import { RouterView } from "vue-router";
import { useFinanceStore } from "./stores/financeStore";
import { useAuthStore } from "./stores/authStore";
import { onMounted, watch } from "vue";

const financeStore = useFinanceStore();
const authStore = useAuthStore();

// Fetch transactions when authenticated
watch(
  () => authStore.isAuthenticated,
  (isAuth) => {
    if (isAuth) {
      financeStore.fetchTransactions();
      financeStore.fetchServices();
    }
  },
  { immediate: true },
);
</script>

<template>
  <RouterView />
</template>
