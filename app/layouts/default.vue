<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-gray-800 h-14 fixed top-0 w-full z-10 text-white text-sm">
      <nav class="container mx-auto h-full flex items-center justify-between px-4">
        <div class="flex items-center gap-6">
          <div class="w-12 h-9 rounded-md flex items-center justify-center bg-gray-600">
            <h1 class="font-bold text-gray-200 text-xs">PVD</h1>
          </div>
          <NuxtLink to="/">Dashboard</NuxtLink>
          <NuxtLink to="/customers">Customers</NuxtLink>
          <NuxtLink to="/registrations">Registrations</NuxtLink>
        </div>
        <Button v-if="user" @click="logout" class="!bg-gray-600 !text-gray-200">
          Logout
        </Button>
      </nav>
    </header>

    <main class="flex-1 container mx-auto px-4 mb-24 mt-16 py-2 overflow-auto  ">
      <Breadcrumb />
      <slot />
    </main>

    <footer class="bg-gray-200 h-14 fixed bottom-0 w-full">
      <div class="container mx-auto h-full flex items-center px-4">
        <p class="text-sm text-gray-500">
          <a href="https://cybernetix.nl" target="_blank">{{ new Date().getFullYear() }} © Cybernetix - Make Advanced Simple </a>
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
  await router.push('/login');
};
</script>

<style scoped>
  a.router-link-active{
    color: #99a1af;
    font-weight: 500;
  }
</style>
