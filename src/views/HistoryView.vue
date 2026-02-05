<script setup>
import { ref, computed, onMounted } from "vue";
import { useFinanceStore } from "../stores/financeStore";
import AppLayout from "../components/layout/AppLayout.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import BaseInput from "../components/ui/BaseInput.vue";
import BaseButton from "../components/ui/BaseButton.vue";
import StatCard from "../components/ui/StatCard.vue";
import {
  Search,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Edit2,
  X,
  Save,
  Wallet,
} from "lucide-vue-next";
import {
  format,
  isWithinInterval,
  startOfDay,
  endOfDay,
  parseISO,
} from "date-fns";

const financeStore = useFinanceStore();
const searchQuery = ref("");
const filterType = ref("all"); // 'all', 'income', 'expense'
const startDate = ref("");
const endDate = ref("");

// Initialize dates to today on mount
onMounted(() => {
  const today = new Date().toISOString().slice(0, 10);
  startDate.value = today;
  endDate.value = today;
});

const editingId = ref(null);
const editForm = ref({
  description: "",
  amount: "",
  category: "",
  date: "",
});

const filteredTransactions = computed(() => {
  return financeStore.transactions.filter((t) => {
    const tDate = new Date(t.date);

    // Search Filter
    const matchesSearch =
      t.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.amount.toString().includes(searchQuery.value);

    // Type Filter
    const matchesType =
      filterType.value === "all" || t.type === filterType.value;

    // Date Range Filter
    let matchesDate = true;
    if (startDate.value && endDate.value) {
      matchesDate = isWithinInterval(tDate, {
        start: startOfDay(parseISO(startDate.value)),
        end: endOfDay(parseISO(endDate.value)),
      });
    } else if (startDate.value) {
      matchesDate = tDate >= startOfDay(parseISO(startDate.value));
    } else if (endDate.value) {
      matchesDate = tDate <= endOfDay(parseISO(endDate.value));
    }

    return matchesSearch && matchesType && matchesDate;
  });
});

const totalIncome = computed(() => {
  return filteredTransactions.value
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
});

const totalExpense = computed(() => {
  return filteredTransactions.value
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString) => {
  return format(new Date(dateString), "dd MMM yyyy, HH:mm");
};

const deleteTransaction = async (id) => {
  if (confirm("Are you sure you want to delete this transaction?")) {
    await financeStore.deleteTransaction(id);
  }
};

const startEdit = (transaction) => {
  editingId.value = transaction.id;
  editForm.value = {
    description: transaction.description,
    amount: transaction.amount,
    category: transaction.category || "",
    date: new Date(transaction.date).toISOString().slice(0, 16), // Format for datetime-local
  };
};

const cancelEdit = () => {
  editingId.value = null;
  editForm.value = { description: "", amount: "", category: "", date: "" };
};

const saveEdit = async () => {
  await financeStore.updateTransaction(editingId.value, {
    description: editForm.value.description,
    amount: Number(editForm.value.amount),
    category: editForm.value.category,
    date: new Date(editForm.value.date),
  });
  cancelEdit();
};
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row gap-4 justify-between items-end">
        <div>
          <h1 class="text-2xl font-bold text-text-primary">
            Transaction History
          </h1>
          <p class="text-text-muted">Manage all your financial records.</p>
        </div>

        <!-- Filters -->
        <div class="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <!-- Date Filters -->
          <div class="flex items-center gap-2">
            <div class="flex flex-col">
              <label class="text-xs text-text-muted ml-1">Start Date</label>
              <input
                v-model="startDate"
                type="date"
                class="px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary text-text-primary h-[42px]"
              />
            </div>
            <div class="flex flex-col">
              <label class="text-xs text-text-muted ml-1">End Date</label>
              <input
                v-model="endDate"
                type="date"
                class="px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary text-text-primary h-[42px]"
              />
            </div>
          </div>

          <!-- Type Filter -->
          <div class="flex flex-col">
            <label class="text-xs text-text-muted ml-1">&nbsp;</label>
            <select
              v-model="filterType"
              class="px-8 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary text-text-primary h-[42px]"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <!-- Search -->
          <div class="flex flex-col flex-1 md:w-64">
            <label class="text-xs text-text-muted ml-1">&nbsp;</label>
            <div class="relative w-full">
              <Search
                class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                size="20"
              />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search..."
                class="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary text-text-primary placeholder:text-text-muted h-[42px]"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Total Income"
          :value="formatCurrency(totalIncome)"
          :icon="ArrowUpRight"
          class="bg-green-500/5 text-green-500"
        />
        <StatCard
          title="Total Expense"
          :value="formatCurrency(totalExpense)"
          :icon="ArrowDownLeft"
          class="bg-red-500/5 text-red-500"
        />
      </div>

      <!-- Table View -->
      <BaseCard class="overflow-hidden p-0">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-surface-hover/50 border-b border-border">
              <tr>
                <th class="p-4 text-left text-text-muted font-medium w-48">
                  Date
                </th>
                <th class="p-4 text-left text-text-muted font-medium">
                  Description
                </th>
                <th class="p-4 text-left text-text-muted font-medium w-32">
                  Category
                </th>
                <th class="p-4 text-left text-text-muted font-medium w-32">
                  Type
                </th>
                <th class="p-4 text-right text-text-muted font-medium w-48">
                  Amount
                </th>
                <th class="p-4 text-right text-text-muted font-medium w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/50">
              <tr
                v-for="transaction in filteredTransactions"
                :key="transaction.id"
                class="hover:bg-surface-hover/30 transition-colors"
              >
                <!-- Editing Mode -->
                <template v-if="editingId === transaction.id">
                  <td class="p-4">
                    <BaseInput v-model="editForm.date" type="datetime-local" />
                  </td>
                  <td class="p-4">
                    <BaseInput v-model="editForm.description" />
                  </td>
                  <td class="p-4">
                    <BaseInput v-model="editForm.category" />
                  </td>
                  <td class="p-4">
                    <span class="text-text-muted">{{ transaction.type }}</span>
                  </td>
                  <td class="p-4">
                    <BaseInput v-model="editForm.amount" type="number" />
                  </td>
                  <td class="p-4 text-right">
                    <div class="flex justify-end gap-2">
                      <button
                        @click="saveEdit"
                        class="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
                        title="Save"
                      >
                        <Save size="18" />
                      </button>
                      <button
                        @click="cancelEdit"
                        class="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"
                        title="Cancel"
                      >
                        <X size="18" />
                      </button>
                    </div>
                  </td>
                </template>

                <!-- Normal Mode -->
                <template v-else>
                  <td class="p-4 text-text-muted whitespace-nowrap">
                    {{ formatDate(transaction.date) }}
                  </td>
                  <td class="p-4 font-medium text-text-primary">
                    {{ transaction.description }}
                  </td>
                  <td class="p-4">
                    <span
                      v-if="transaction.category"
                      class="px-2 py-1 rounded-full bg-surface-hover text-xs whitespace-nowrap"
                    >
                      {{ transaction.category }}
                    </span>
                    <span v-else class="text-text-muted">-</span>
                  </td>
                  <td class="p-4">
                    <div
                      class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                      :class="
                        transaction.type === 'income'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-red-500/10 text-red-500'
                      "
                    >
                      <ArrowUpRight
                        v-if="transaction.type === 'income'"
                        size="14"
                      />
                      <ArrowDownLeft v-else size="14" />
                      <span class="capitalize">{{ transaction.type }}</span>
                    </div>
                  </td>
                  <td
                    class="p-4 text-right font-mono font-medium"
                    :class="
                      transaction.type === 'income'
                        ? 'text-green-500'
                        : 'text-red-500'
                    "
                  >
                    {{ transaction.type === "income" ? "+" : "-" }}
                    {{ formatCurrency(transaction.amount) }}
                  </td>
                  <td class="p-4 text-right">
                    <div class="flex justify-end gap-2">
                      <button
                        @click="startEdit(transaction)"
                        class="p-2 hover:bg-surface-hover rounded-lg text-text-muted hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Edit2 size="18" />
                      </button>
                      <button
                        @click="deleteTransaction(transaction.id)"
                        class="p-2 hover:bg-surface-hover rounded-lg text-text-muted hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size="18" />
                      </button>
                    </div>
                  </td>
                </template>
              </tr>

              <tr v-if="filteredTransactions.length === 0">
                <td colspan="6" class="p-12 text-center text-text-muted">
                  No transactions found matching your criteria.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>
    </div>
  </AppLayout>
</template>
