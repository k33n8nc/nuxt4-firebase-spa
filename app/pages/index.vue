<template>
  <div class="grid md:grid-cols-3 gap-4 mt-8">
    <NuxtLink to="/customers" class="shadow rounded">
      <div class="p-6 text-sm text-gray-700">
        <p class="text-sm font-medium">Customers</p>
        <p class="text-lg">190</p>
      </div>
    </NuxtLink>

    <NuxtLink to="/registrations" class="shadow rounded">
      <div class="p-6 text-sm text-gray-700">
        <p class="text-sm font-medium">Registrations</p>
        <p class="text-lg">572</p>
      </div>
    </NuxtLink>

    <NuxtLink to="/calendar" class="shadow rounded">
      <div class="p-6 text-sm text-gray-700">
        <p class="text-sm font-medium">Calendar</p>
        <p class="text-lg">12</p>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useBreadcrumbs } from '~/composables/useBreadcrumbs';

definePageMeta({
  middleware: 'auth'
});

const { setBreadcrumbs } = useBreadcrumbs();

setBreadcrumbs([
  { text: 'Dashboard', to: '/' },
]);
</script>