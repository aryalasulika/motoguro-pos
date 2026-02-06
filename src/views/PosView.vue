<script setup>
import AppLayout from "../components/layout/AppLayout.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import BaseButton from "../components/ui/BaseButton.vue";
import BaseInput from "../components/ui/BaseInput.vue";
import { useFinanceStore } from "../stores/financeStore";
import { storeToRefs } from "pinia";
import { ref, computed } from "vue";
import { CheckCircle2, ShoppingCart, Trash2, Plus } from "lucide-vue-next";

const financeStore = useFinanceStore();
const { serviceTypes } = storeToRefs(financeStore);
const { addTransaction } = financeStore;

// Cart State
const cart = ref([]);
const plateNumber = ref("");
const customerName = ref("");
const additionalNotes = ref("");
const showSuccess = ref(false);

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const addToCart = (service) => {
  cart.value.push({ ...service, cartId: Date.now() + Math.random() });
};

const removeFromCart = (index) => {
  cart.value.splice(index, 1);
};

const totalAmount = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price, 0);
});

const handleCheckout = () => {
  if (cart.value.length === 0) return;

  // Combine descriptions: "Service A, Service B"
  const serviceNames = cart.value.map((item) => item.name).join(", ");
  const description = `${serviceNames}${plateNumber.value ? ` - ${plateNumber.value}` : ""}`;

  addTransaction({
    type: "income",
    amount: totalAmount.value, // Use calculated total
    description: description,
    category: "Service",
    customer: customerName.value,
    notes: additionalNotes.value,
  });

  // Reset & Show Feedback
  showSuccess.value = true;
  cart.value = []; // Clear cart
  plateNumber.value = "";
  customerName.value = "";
  additionalNotes.value = "";

  setTimeout(() => {
    showSuccess.value = false;
  }, 3000);
};
</script>

<template>
  <AppLayout>
    <div class="mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold">Point of Sale</h2>
          <p class="text-text-muted">Select services to add to cart.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Service Selection -->
        <div class="lg:col-span-2 space-y-4">
          <h3 class="font-medium text-lg">Services</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <BaseButton
              v-for="service in serviceTypes"
              :key="service.id"
              @click="addToCart(service)"
              variant="outline"
              class="h-32 flex flex-col items-center justify-center gap-2 p-4 transition-all hover:scale-105 border-2 text-wrap text-center group active:scale-95"
              class-active="border-primary bg-primary/5"
            >
              <span
                class="font-bold text-lg group-hover:text-primary transition-colors"
                >{{ service.name }}</span
              >
              <span class="text-text-muted">{{
                formatCurrency(service.price)
              }}</span>
              <div
                class="opacity-0 group-hover:opacity-100 transition-opacity text-primary text-xs flex items-center gap-1"
              >
                <Plus size="14" /> Add
              </div>
            </BaseButton>
          </div>
        </div>

        <!-- Checkout Panel -->
        <div class="lg:col-span-1">
          <BaseCard
            class="sticky top-24 space-y-6 flex flex-col h-[calc(100vh-8rem)]"
          >
            <h3
              class="font-bold text-xl border-b border-border pb-4 flex items-center gap-2 shrink-0"
            >
              <ShoppingCart size="20" />
              Current Order
            </h3>

            <!-- Cart Items List -->
            <div class="flex-1 overflow-y-auto space-y-3 pr-2 -mr-2">
              <div
                v-if="cart.length === 0"
                class="text-center py-10 text-text-muted"
              >
                <p>Cart is empty.</p>
                <p class="text-sm">Click services to add them.</p>
              </div>

              <div
                v-for="(item, index) in cart"
                :key="item.cartId"
                class="flex justify-between items-center p-3 bg-surface-hover/50 rounded-lg group"
              >
                <div class="flex-1">
                  <div class="font-medium">{{ item.name }}</div>
                  <div class="text-sm text-text-muted">
                    {{ formatCurrency(item.price) }}
                  </div>
                </div>
                <button
                  @click="removeFromCart(index)"
                  class="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove"
                >
                  <Trash2 size="18" />
                </button>
              </div>
            </div>

            <!-- Footer: Totals & Action -->
            <div class="space-y-4 pt-4 border-t border-border shrink-0">
              <div class="flex justify-between items-center text-xl font-bold">
                <span>Total</span>
                <span class="text-primary">{{
                  formatCurrency(totalAmount)
                }}</span>
              </div>

              <div class="space-y-3">
                <BaseInput
                  v-model="plateNumber"
                  label="Plate Number (Optional)"
                  placeholder="e.g. B 1234 CD"
                />
                <!-- <BaseInput v-model="customerName" label="Customer Name (Optional)" placeholder="e.g. John Doe" /> -->
              </div>

              <BaseButton
                block
                @click="handleCheckout"
                class="py-4 text-lg font-bold"
                :disabled="cart.length === 0"
                :class="
                  cart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                "
              >
                Complete Payment
                {{ cart.length > 0 ? `(${cart.length} items)` : "" }}
              </BaseButton>
            </div>
          </BaseCard>
        </div>
      </div>
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
        class="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50"
      >
        <CheckCircle2 size="24" />
        <div>
          <h4 class="font-bold">Transaction Saved!</h4>
        </div>
      </div>
    </Transition>
  </AppLayout>
</template>
