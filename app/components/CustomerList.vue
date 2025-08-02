<template>
  <div class="grid grid-cols-3 gap-4">
    <div v-if="isLoading">Loading customers...</div>
      <div v-for="customer in customerStore.customers"
           :key="customer.id"
           class="shadow"
      >
        <NuxtLink :to="{ name: 'customers-id', params: { id: customer.id } }">
          <div class="p-6 text-sm text-gray-700">
            <p>{{ customer.commercial_name }}</p>
            <p>reg: 100</p>
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
    // Optionally, you could add a user-facing error message here
  } finally {
    isLoading.value = false;
  }
});
</script>
