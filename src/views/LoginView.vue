<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import BaseButton from "../components/ui/BaseButton.vue";
import BaseInput from "../components/ui/BaseInput.vue";
import { AlertCircle, Loader2 } from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const handleLogin = async () => {
  error.value = "";
  loading.value = true;

  // Basic validation
  if (!email.value || !password.value) {
    error.value = "Please fill in all fields";
    loading.value = false;
    return;
  }

  const success = await authStore.login(email.value, password.value);

  if (success) {
    router.push("/");
  } else {
    error.value = "Invalid credentials";
  }
  loading.value = false;
};
</script>

<template>
  <div
    class="min-h-screen bg-background flex flex-col items-center justify-center p-4"
  >
    <div class="w-full max-w-md space-y-8">
      <!-- Logo/Brand -->
      <div class="text-center">
        <h1
          class="text-3xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent mb-2"
        >
          MOTOGURO
        </h1>
        <p class="text-text-muted">Login untuk masuk ke dalam aplikasi</p>
      </div>

      <div class="bg-surface border border-border rounded-xl p-8 shadow-lg">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <BaseInput
            v-model="email"
            type="email"
            label="Email"
            placeholder="Masukan Email"
            class="w-full"
          />

          <BaseInput
            v-model="password"
            type="password"
            label="Password"
            placeholder="Masukan Password"
            class="w-full"
          />

          <div
            v-if="error"
            class="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg"
          >
            <AlertCircle size="16" />
            <span>{{ error }}</span>
          </div>

          <BaseButton
            block
            type="submit"
            class="w-full flex items-center justify-center gap-2"
            :disabled="loading"
          >
            <Loader2 v-if="loading" class="animate-spin" size="20" />
            <span v-else>Sign In</span>
          </BaseButton>
        </form>
      </div>
    </div>
  </div>
</template>
