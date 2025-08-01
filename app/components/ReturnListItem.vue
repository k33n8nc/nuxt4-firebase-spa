<template>
  <div class="p-4 border rounded-lg shadow-sm bg-white transition-shadow hover:shadow-md">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="font-bold text-lg text-emerald-700">{{ customerReturn.store }}</h3>
        <p class="text-xs text-gray-500">
          Added on: {{ formattedDate }}
        </p>
      </div>
      <div class="text-right">
        <p class="font-semibold text-xl">{{ totalValue.toFixed(2) }} €</p>
        <p class="text-sm text-gray-600">{{ customerReturn.items.length }} items</p>
      </div>
    </div>
    <div class="mt-4">
      <ul class="space-y-1 text-sm">
        <li v-for="item in customerReturn.items" :key="item.id" class="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span>{{ item.name }}</span>
          <span class="font-medium">{{ item.price.toFixed(2) }} €</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CustomerReturn } from '#shared/types/customerReturn';

const props = defineProps<{
  customerReturn: CustomerReturn;
}>();

const totalValue = computed(() => {
  return props.customerReturn.items.reduce((sum, item) => sum + item.price, 0);
});

const formattedDate = computed(() => {
  if (!props.customerReturn.createdAt) return 'N/A';
  return new Date(props.customerReturn.createdAt).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});
</script>