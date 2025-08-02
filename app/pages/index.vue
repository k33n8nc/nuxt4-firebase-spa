<template>
  <div class="container max-w-3xl p-4 mx-auto">
    <!-- The header is in the layout, so we can remove the h1 from here if we want -->

    <div class="mt-6">
      Dashboard
    </div>

  </div>
</template>

<script setup lang="ts">
// This will apply the 'auth' middleware to this page
definePageMeta({
  middleware: 'auth'
});
</script>