<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-gray-200 h-14 fixed top-0 w-full z-10">
      <nav class="container mx-auto h-full flex items-center justify-between px-4">
        <div class="flex items-center gap-4">
          <div>
            <h1 class="font-bold">C8X</h1>
          </div>
          <NuxtLink to="/">Dashboard</NuxtLink>
          <NuxtLink to="/customers">Customers</NuxtLink>
        </div>
        <Button v-if="user" @click="logout">
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
          free to copy © <a href="https://cybernetix.nl" target="_blank">cybernetix {{ new Date().getFullYear() }}</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { getAuth, signOut } from 'firebase/auth';
import { useAuth } from '~/composables/useAuth';
import Breadcrumb from '~/components/Breadcrumb.vue';

const { user } = useAuth();
const router = useRouter();

const logout = async () => {
  const auth = getAuth();
  await signOut(auth);
  await router.push('/login');
};
</script>
