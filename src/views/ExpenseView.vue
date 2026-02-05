<script setup>
import AppLayout from "../components/layout/AppLayout.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import BaseButton from "../components/ui/BaseButton.vue";
import BaseInput from "../components/ui/BaseInput.vue";
import { useFinanceStore } from "../stores/financeStore";
import { ref } from "vue";
import { CheckCircle2, TrendingDown } from "lucide-vue-next";

const financeStore = useFinanceStore();
const { addTransaction } = financeStore;

const amount = ref("");
const description = ref("");
const category = ref("");
const showSuccess = ref(false);

const handleAddExpense = () => {
  if (!amount.value || !description.value) return;

  addTransaction({
    type: "expense",
    amount: Number(amount.value),
    description: description.value,
    category: category.value || "General",
  });

  // Reset & Show Feedback
  showSuccess.value = true;
  amount.value = "";
  description.value = "";
  category.value = "";

  setTimeout(() => {
    showSuccess.value = false;
  }, 3000);
};
</script>

<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 class="text-2xl font-bold">Expenses</h2>
        <p class="text-text-muted">Record business purchases and costs.</p>
      </div>

      <BaseCard>
        <div class="space-y-6">
          <div class="flex items-center gap-2 mb-4 text-red-500">
            <TrendingDown size="24" />
            <h3 class="text-lg font-bold text-text">New Expense</h3>
          </div>

          <BaseInput
            v-model="description"
            label="Description"
            placeholder="e.g. Soap refill, Electricity token"
          />

          <BaseInput
            v-model="amount"
            type="number"
            label="Amount (IDR)"
            placeholder="0"
          />

          <BaseInput
            v-model="category"
            label="Category (Optional)"
            placeholder="e.g. Supplies, Utility"
          />

          <BaseButton
            block
            @click="handleAddExpense"
            variant="danger"
            class="mt-4"
          >
            Record Expense
          </BaseButton>
        </div>
      </BaseCard>
    </div>
    <!-- Success Toast -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-10 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-10 opacity-0"
    >
      <div
        v-if="showSuccess"
        class="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50"
      >
        <CheckCircle2 size="24" />
        <div>
          <h4 class="font-bold">Recorded!</h4>
          <p class="text-sm">Expense saved successfully.</p>
        </div>
      </div>
    </Transition>
  </AppLayout>
</template>
