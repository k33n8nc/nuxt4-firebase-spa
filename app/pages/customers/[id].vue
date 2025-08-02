<template>
  <div>
    <div v-if="isLoading">Loading customer details...</div>
    <CustomerForm v-else-if="customer" :customer="customer" />
    <div v-else>
      <p>Customer not found.</p>
    </div>
    <NuxtLink to="/customers" class="mt-4 inline-block text-blue-500 hover:underline">Back to Customers</NuxtLink>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCustomerStore, type Customer } from '@/stores/customerStore';
import { useRoute } from 'vue-router';
import CustomerForm from '@/components/CustomerForm.vue';

const customerStore = useCustomerStore();
const route = useRoute();
const customerId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

// This page now manages its own state for the customer being edited.
const customer = ref<Customer | null>(null);
const isLoading = ref(true);

onMounted(async () => {
  if (customerId) {
    isLoading.value = true;
    // Fetch the customer and store it in local state.
    customer.value = await customerStore.fetchCustomerById(customerId);
    isLoading.value = false;
  }
});

definePageMeta({
  middleware: 'auth',
});
</script>
