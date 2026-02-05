<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary", // primary, secondary, danger, outline
  },
  block: {
    type: Boolean,
    default: false,
  },
});

const baseClasses =
  "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses = computed(() => {
  switch (props.variant) {
    case "primary":
      return "bg-primary text-white hover:bg-primary-hover focus:ring-primary";
    case "secondary":
      return "bg-surface text-text hover:bg-zinc-700 focus:ring-zinc-600 border border-border";
    case "danger":
      return "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500";
    case "outline":
      return "bg-transparent text-primary border border-primary hover:bg-primary/10 focus:ring-primary";
    default:
      return "bg-primary text-white hover:bg-primary-hover";
  }
});
</script>

<template>
  <button :class="[baseClasses, variantClasses, { 'w-full': block }]">
    <slot></slot>
  </button>
</template>
