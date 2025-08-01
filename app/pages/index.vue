<template>
  <div class="container max-w-3xl p-4 mx-auto">
    <!-- The header is in the layout, so we can remove the h1 from here if we want -->

    <div class="mt-6">
      <ReturnForm />
    </div>

    <ReturnList />
  </div>
</template>

<script setup lang="ts">
import { useReturnStore } from '~/stores/returnStore';

// This will apply the 'auth' middleware to this page
definePageMeta({
  middleware: 'auth'
});

// Set the page title
useHead({
  title: 'Returns Tracker'
})

// Initialize the store
const returnStore = useReturnStore();

// Fetch initial data when the component is mounted.
// Since ssr: false, this will run on the client side after hydration.
onMounted(() => {
  returnStore.fetchReturns();
});
</script>