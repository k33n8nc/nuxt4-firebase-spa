<template>
  <div class="mt-10">
    <h2 class="text-xl font-semibold mb-4 text-gray-800">Active Returns</h2>

    <!-- Loading Skeleton -->
    <div v-if="returnStore.isLoading && returnStore.returns.length === 0" class="space-y-4">
      <div class="p-4 border rounded-lg bg-gray-100 animate-pulse h-28 w-full"></div>
      <div class="p-4 border rounded-lg bg-gray-100 animate-pulse h-28 w-full"></div>
    </div>

    <!-- List of Returns -->
    <div v-else-if="returnStore.returns.length > 0" class="space-y-4">
      <ReturnListItem
          v-for="customerReturn in returnStore.returns"
          :key="customerReturn.id"
          :customer-return="customerReturn"
      />
    </div>

    <!-- No Returns Message -->
    <div v-else class="text-center p-8 border-2 border-dashed rounded-lg text-gray-500 mt-6">
      <p class="font-medium">No returns have been added yet.</p>
      <p class="text-sm">Use the form above to add your first one!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReturnStore } from '~/stores/returnStore';

const returnStore = useReturnStore();
// The fetching logic will be in index.vue on mount, so this component just displays the state.
</script>