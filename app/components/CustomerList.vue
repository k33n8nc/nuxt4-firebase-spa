<template>
  <div>
    <div v-if="customerStore.isLoading">Loading customers...</div>
    <ul v-else-if="customerStore.customers.length">
      <li v-for="customer in customerStore.customers" :key="customer.id">
        <NuxtLink :to="`/customers/${customer.id}`">{{ customer.commercial_name }}</NuxtLink>
      </li>
    </ul>
    <div v-else>No customers found. You can add one using the form above.</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCustomerStore } from '@/stores/customerStore';

const customerStore = useCustomerStore();

// Fetch customers when the component is mounted
onMounted(() => {
  customerStore.fetchCustomers();
});
</script>
