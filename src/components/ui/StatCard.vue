<script setup>
import BaseCard from "./BaseCard.vue";

defineProps({
  title: String,
  value: [String, Number],
  trend: String,
  icon: Object, // Component
});
</script>

<template>
  <BaseCard class="flex items-center gap-4">
    <div v-if="icon" class="p-3 rounded-lg bg-primary/10 text-primary">
      <component :is="icon" size="24" />
    </div>
    <div>
      <p class="text-sm text-text-muted font-medium">{{ title }}</p>
      <h3 class="text-2xl font-bold text-text mt-1">{{ value }}</h3>
    </div>
  </BaseCard>
</template>
