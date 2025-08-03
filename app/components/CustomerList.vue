<template>
  <div class="grid grid-cols-3 gap-4 mt-8">
    <div v-if="isLoading">Loading customers...</div>
      <div v-for="customer in customerStore.customers"
           :key="customer.id"
           class="shadow rounded"
      >
        <NuxtLink :to="{ name: 'customers-id', params: { id: customer.id } }">
          <div class="p-6 text-sm text-gray-700">
            <p class="text-sm font-medium">{{ customer.city }}</p>
            <p class="text-lg">{{ customer.commercial_name }}</p>
          </div>
        </NuxtLink>
      </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCustomerStore } from '@/stores/customerStore';

const customerStore = useCustomerStore();
const isLoading = ref(false);

// Fetch customers when the component is mounted
onMounted(async () => {
  isLoading.value = true;
  try {
    await customerStore.fetchCustomers();
  } catch (error) {
    console.error("Failed to fetch customers:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>
