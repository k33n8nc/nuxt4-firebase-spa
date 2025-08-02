<template>
  <div class="mt-6">
    Dashboard
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