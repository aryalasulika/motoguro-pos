<script setup>
import AppLayout from "../components/layout/AppLayout.vue";
import StatCard from "../components/ui/StatCard.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import { useFinanceStore } from "../stores/financeStore";
import { storeToRefs } from "pinia";
import {
  Wallet,
  Banknote,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-vue-next";
import { format } from "date-fns";

const financeStore = useFinanceStore();
const { incomeToday, expenseToday, netProfitToday, recentActivity } =
  storeToRefs(financeStore);

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
};
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold">Dashboard</h2>
        <p class="text-text-muted">Overview of your business today.</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Income Today"
          :value="formatCurrency(incomeToday)"
          :icon="Wallet"
        />
        <StatCard
          title="Expenses Today"
          :value="formatCurrency(expenseToday)"
          :icon="Banknote"
        />
        <StatCard
          title="Net Profit"
          :value="formatCurrency(netProfitToday)"
          :icon="TrendingUp"
          class="border-primary/50 bg-primary/5"
        />
      </div>

      <!-- Recent Activity -->
      <BaseCard>
        <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
          <Calendar size="20" class="text-primary" />
          Recent Activity
        </h3>

        <div v-if="recentActivity.length > 0" class="space-y-4">
          <div
            v-for="item in recentActivity"
            :key="item.id"
            class="flex justify-between items-center py-3 border-b border-border/50 last:border-0 hover:bg-zinc-800/50 -mx-2 px-2 rounded-lg transition-colors"
          >
            <div class="flex items-start gap-3">
              <div
                class="p-2 rounded-full"
                :class="
                  item.type === 'income'
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-red-500/10 text-red-500'
                "
              >
                <ArrowUpRight v-if="item.type === 'income'" size="16" />
                <ArrowDownRight v-else size="16" />
              </div>
              <div>
                <p class="font-medium text-text">{{ item.description }}</p>
                <p class="text-xs text-text-muted">
                  {{ format(new Date(item.date), "dd MMM yyyy, HH:mm") }}
                </p>
              </div>
            </div>
            <span
              class="font-mono font-medium"
              :class="
                item.type === 'income' ? 'text-green-500' : 'text-red-500'
              "
            >
              {{ item.type === "income" ? "+" : "-" }}
              {{ formatCurrency(item.amount) }}
            </span>
          </div>
        </div>

        <div v-else class="text-center py-12 text-text-muted">
          No transactions yet. Start by adding one in POS.
        </div>
      </BaseCard>
    </div>
  </AppLayout>
</template>
