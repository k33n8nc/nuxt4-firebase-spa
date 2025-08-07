<template>
  <div class="flex flex-col items-center justify-center bg-gray-100 h-screen overflow-y-auto">
    <h1 class="font-medium text-center mb-4">Login to Paul van Dam</h1>
    <div class="w-md mx-auto border-gray-200 shadow p-8 rounded-lg bg-white">
      <form @submit.prevent="login">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input v-model="email" type="email" id="email" required class="w-full px-3 py-2 mt-1 border-1 border border-gray-200 rounded-md">
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input v-model="password" type="password" id="password" required class="w-full px-3 py-2 mt-1 border border-gray-200 rounded-md">
          </div>
        </div>
        <div class="mt-6 flex justify-between items-center">
          <NuxtLink to="/" class="underline text-sm">forgot password?</NuxtLink>
          <Button type="submit">
            Login
          </Button>
        </div>
        <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

definePageMeta({
  layout: 'login',
});

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const login = async () => {
  const auth = getAuth();
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    await router.push('/');
  } catch (e: any) {
    error.value = e.message;
  }
};
</script>
