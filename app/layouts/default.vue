<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-gray-200 h-14 fixed top-0 w-full z-10">
      <nav class="container mx-auto h-full flex items-center justify-between px-4">
        <div class="flex items-center gap-4">
          <div>
            <h1 class="font-bold">Nuxt 4 + Tawilwind 4 Starter</h1>
            <small>See readme and package.json for more info.</small>
          </div>
          <NuxtLink to="/">Returns</NuxtLink>
          <NuxtLink to="/customers">Customers</NuxtLink>
        </div>
        <button v-if="user" @click="logout" class="px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          Logout
        </button>
      </nav>
    </header>

    <main class="flex-1 container mx-auto px-4 mt-14 mb-14 overflow-auto  ">
      <slot />
    </main>

    <footer class="bg-gray-200 h-14 fixed bottom-0 w-full">
      <div class="container mx-auto h-full flex items-center px-4">
        <p class="text-sm text-gray-500">
          free to copy © <a href="https://cybernetix.nl" target="_blank">cybernetix {{ new Date().getFullYear() }}</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { getAuth, signOut } from 'firebase/auth';
import { useAuth } from '~/composables/useAuth';

const { user } = useAuth();
const router = useRouter();

const logout = async () => {
  const auth = getAuth();
  await signOut(auth);
  router.push('/login');
};
</script>
