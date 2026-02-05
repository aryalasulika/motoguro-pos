<script setup>
import { ref } from "vue";
import { useFinanceStore } from "../stores/financeStore";
import AppLayout from "../components/layout/AppLayout.vue";
import BaseButton from "../components/ui/BaseButton.vue";
import BaseInput from "../components/ui/BaseInput.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import { Plus, Trash2, Edit2, Save, X } from "lucide-vue-next";

const financeStore = useFinanceStore();
const editingId = ref(null);
const editForm = ref({
  name: "",
  price: "",
  description: "",
});

const isAdding = ref(false);
const newService = ref({
  name: "",
  price: "",
  description: "",
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const startEdit = (service) => {
  editingId.value = service.id;
  editForm.value = { ...service };
};

const cancelEdit = () => {
  editingId.value = null;
  editForm.value = { name: "", price: "", description: "" };
};

const saveEdit = async () => {
  await financeStore.updateService(editingId.value, {
    name: editForm.value.name,
    price: Number(editForm.value.price),
    description: editForm.value.description,
  });
  cancelEdit();
};

const deleteService = async (id) => {
  if (confirm("Are you sure you want to delete this service?")) {
    await financeStore.deleteService(id);
  }
};

const startAdd = () => {
  isAdding.value = true;
  newService.value = { name: "", price: "", description: "" };
};

const cancelAdd = () => {
  isAdding.value = false;
  newService.value = { name: "", price: "", description: "" };
};

const saveAdd = async () => {
  await financeStore.addService({
    name: newService.value.name,
    price: Number(newService.value.price),
    description: newService.value.description,
  });
  cancelAdd();
};
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-text-primary">Settings</h1>
        <BaseButton @click="startAdd" v-if="!isAdding">
          <div class="flex items-center gap-2">
            <Plus size="20" />
            <span>Add Service</span>
          </div>
        </BaseButton>
      </div>

      <!-- Add Service Form -->
      <BaseCard v-if="isAdding" class="space-y-4 border-primary">
        <h3 class="font-semibold text-lg">New Service</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BaseInput
            v-model="newService.name"
            label="Service Name"
            placeholder="e.g. Cuci Kilat"
          />
          <BaseInput
            v-model="newService.price"
            type="number"
            label="Price"
            placeholder="0"
          />
          <BaseInput
            v-model="newService.description"
            label="Description"
            placeholder="Optional"
          />
        </div>
        <div class="flex justify-end gap-2">
          <BaseButton variant="outline" @click="cancelAdd">Cancel</BaseButton>
          <BaseButton @click="saveAdd">Save Service</BaseButton>
        </div>
      </BaseCard>

      <!-- Services List -->
      <BaseCard>
        <h2 class="text-xl font-semibold mb-4">Service Menu</h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-border text-left">
                <th class="p-4 text-text-muted font-medium">Name</th>
                <th class="p-4 text-text-muted font-medium">Price</th>
                <th class="p-4 text-text-muted font-medium">Description</th>
                <th class="p-4 text-text-muted font-medium text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="service in financeStore.serviceTypes"
                :key="service.id"
                class="border-b border-border/50 last:border-0 hover:bg-surface-hover"
              >
                <template v-if="editingId === service.id">
                  <td class="p-4">
                    <BaseInput v-model="editForm.name" class="w-full" />
                  </td>
                  <td class="p-4">
                    <BaseInput
                      v-model="editForm.price"
                      type="number"
                      class="w-24"
                    />
                  </td>
                  <td class="p-4">
                    <BaseInput v-model="editForm.description" class="w-full" />
                  </td>
                  <td class="p-4 text-right">
                    <div class="flex justify-end gap-2">
                      <button
                        @click="saveEdit"
                        class="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
                      >
                        <Save size="18" />
                      </button>
                      <button
                        @click="cancelEdit"
                        class="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"
                      >
                        <X size="18" />
                      </button>
                    </div>
                  </td>
                </template>
                <template v-else>
                  <td class="p-4 font-medium">{{ service.name }}</td>
                  <td class="p-4 text-primary">
                    {{ formatCurrency(service.price) }}
                  </td>
                  <td class="p-4 text-text-muted">
                    {{ service.description || "-" }}
                  </td>
                  <td class="p-4 text-right">
                    <div class="flex justify-end gap-2">
                      <button
                        @click="startEdit(service)"
                        class="p-2 hover:bg-surface-hover rounded-lg text-text-muted hover:text-primary transition-colors"
                      >
                        <Edit2 size="18" />
                      </button>
                      <button
                        @click="deleteService(service.id)"
                        class="p-2 hover:bg-surface-hover rounded-lg text-text-muted hover:text-red-500 transition-colors"
                      >
                        <Trash2 size="18" />
                      </button>
                    </div>
                  </td>
                </template>
              </tr>
              <tr v-if="financeStore.serviceTypes.length === 0">
                <td colspan="4" class="p-8 text-center text-text-muted">
                  No services found. Add one to get started!
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>
    </div>
  </AppLayout>
</template>
