<template>
  <div>
    <div v-if="isLoading">Loading customers...</div>
    <ul v-else-if="customerStore.customers.length">
      <li v-for="customer in customerStore.customers" :key="customer.id">
        <NuxtLink :to="{ name: 'customers-id', params: { id: customer.id } }">{{ customer.commercial_name }}</NuxtLink>
      </li>
    </ul>
    <div v-else>No customers found. You can add one using the form above.</div>
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
