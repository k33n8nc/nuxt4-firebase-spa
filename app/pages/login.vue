<template>
<div class="w-md mx-auto">
  <div class="shadow p-8 rounded-lg">
    <h1 class="text-2xl font-bold text-center">Login</h1>
    <form @submit.prevent="login">
      <div class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" id="email" required class="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" type="password" id="password" required class="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
        </div>
      </div>
      <div class="mt-6">
        <button type="submit" class="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Login
        </button>
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
    router.push('/');
  } catch (e: any) {
    error.value = e.message;
  }
};
</script>
