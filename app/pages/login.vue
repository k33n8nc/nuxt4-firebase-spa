<template>
  <div class="flex flex-col items-center justify-center bg-gray-100 h-screen overflow-y-auto">
    <div class="w-md bg-white rounded-md shadow mb-4 px-6 py-4">
      <h2 class="text-xl">Cybernetix</h2>
      <p class="font-light text-sm">Make. Advanced. Simple.</p>
    </div>
    <div class="w-md mx-auto border-gray-200 shadow p-8 rounded-lg bg-white">
      <form @submit.prevent="login">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input v-model="email" type="email" id="email" required class="w-full px-3 py-2 mt-1 border border-gray-200 rounded-md focus:outline-none focus:border-gray-800 autofill:!bg-red-200">
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input v-model="password" type="password" id="password" required class="w-full px-3 py-2 mt-1 border border-gray-200 rounded-md focus:outline-none focus:border-gray-800 autofill:!bg-yellow-200">
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

<style>


input:-webkit-autofill {
  border: 1px solid #e5e7eb;
  border-radius: .3rem;
  caret-color: #1e2939; /* Pour le I quand on édite */
  color: #1e2939;
  background: #e5e7eb;
  /* webkit autofill */
  -webkit-text-fill-color: #1e2939; /* Surcharge la font color d'autofill */
  -webkit-background-clip: text; /* Supprime le background autofill, utile pour le border radius */
  box-shadow: 0 0 0 50px #e5e7eb inset; /* Ajoute un fake background à base d'ombrage aplatit */
}


</style>