<template>
  <form @submit.prevent="submitCustomer" class="grid grid-cols-2 gap-2">
    <input v-model="customer.commercial_name"
           placeholder="Commercial Name"
           class="border border-gray-200 rounded py-2 px-3 col-span-2" />
    <input v-model="customer.postal_code"
           placeholder="Postal Code"
           class="border border-gray-200 rounded py-2 px-3"/>
    <input v-model="customer.house_number"
           placeholder="House Number"
           class="border border-gray-200 rounded py-2 px-3"/>
    <input v-model="customer.street_name"
           placeholder="Street Name"
           class="border border-gray-200 rounded py-2 px-3"/>
    <input v-model="customer.city"
           placeholder="City"
           class="border border-gray-200 rounded py-2 px-3"/>
    <Button type="submit" :disabled="customerStore.isLoading">Add Customer</Button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCustomerStore } from '@/stores/customerStore';

const customerStore = useCustomerStore();

const customer = ref({
  commercial_name: '',
  street_name: '',
  house_number: '',
  postal_code: '',
  city: '',
});

const submitCustomer = async () => {
  // Basic validation
  if (!customer.value.commercial_name) {
    alert('Commercial name is required.');
    return;
  }
  await customerStore.addCustomer(customer.value);
  // Reset form
  customer.value = {
    commercial_name: '',
    street_name: '',
    house_number: '',
    postal_code: '',
    city: '',
  };
};
</script>
