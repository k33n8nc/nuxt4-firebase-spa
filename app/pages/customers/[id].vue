<template>
  <div>
    Customer LIST
    <div v-if="customerStore.isLoading">Loading customer details...</div>
    <div v-else-if="customerStore.currentCustomer">
      <h1>{{ customerStore.currentCustomer.commercial_name }}</h1>
      <p>{{ customerStore.currentCustomer.street_name }} {{ customerStore.currentCustomer.house_number }}</p>
      <p>{{ customerStore.currentCustomer.postal_code }} {{ customerStore.currentCustomer.city }}</p>
      <NuxtLink to="/customers">Back to Customers</NuxtLink>
    </div>
    <div v-else>
      <p>Customer not found.</p>
      <NuxtLink to="/customers">Back to Customers</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCustomerStore } from '@/stores/customerStore';
import { useRoute } from 'vue-router';

const customerStore = useCustomerStore();
const route = useRoute();
const customerId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

onMounted(() => {
  if (customerId) {
    customerStore.fetchCustomerById(customerId);
  }
});

definePageMeta({
  middleware: 'auth',
});
</script>
