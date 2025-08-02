<template>
  <div class="container max-w-3xl p-4 mx-auto">
    <div class="mt-6">
      Dashboard
    </div>
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