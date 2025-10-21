<template>
  <div>
    <div class="mt-8">
      <div class="flex">
        <input type="text"
               v-model="searchQuery"
               placeholder="Search by registration ID or label..."
               class="h-10 px-2 flex-1 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
        >
      </div>
      <RegistrationList :search-query="searchQuery" />
    </div>
    <RegistrationForm />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useBreadcrumbs } from '~/composables/useBreadcrumbs';

definePageMeta({
  middleware: 'auth',
});

const { setBreadcrumbs } = useBreadcrumbs();
const searchQuery = ref('');

setBreadcrumbs([
  { text: 'Dashboard', to: '/' },
  { text: 'Registrations', to: '/registrations' },
]);
</script>
