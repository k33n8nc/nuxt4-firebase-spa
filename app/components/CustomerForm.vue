<template>
  <div v-if="isCustomerFormOpen" class="fixed inset-0 z-40 bg-black/[var(--bg-opacity)] [--bg-opacity:50%]" @click.self="closeCustomerForm">
    <div class="fixed top-0 right-0 h-full bg-white w-96 shadow-lg p-6 z-50">
      <button @click="closeCustomerForm" class="absolute top-4 right-4 text-gray-500 hover:text-gray-800">&times;</button>
      <h2 class="text-2xl font-bold mb-4">{{ editingCustomer ? 'Edit Customer' : 'Add Customer' }}</h2>
      <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4">
        <div class="col-span-2">
          <label for="commercial_name" class="block text-sm font-medium text-gray-700">Commercial Name</label>
          <input type="text" id="commercial_name" v-model="formData.commercial_name" required
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label for="postal_code" class="block text-sm font-medium text-gray-700">Postal Code</label>
          <input type="text" id="postal_code" v-model="formData.postal_code" required
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label for="house_number" class="block text-sm font-medium text-gray-700">House Number</label>
          <input type="text" id="house_number" v-model="formData.house_number" @blur="fetchAddressDetails" required
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label for="street_name" class="block text-sm font-medium text-gray-700">Street Name</label>
          <input type="text" id="street_name" v-model="formData.street_name" required
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label for="city" class="block text-sm font-medium text-gray-700">City</label>
          <input type="text" id="city" v-model="formData.city" required
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <Button type="submit" class="col-span-2">{{ editingCustomer ? 'Update Customer' : 'Add Customer' }}</Button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerForm } from '~/composables/useCustomerForm';
import type { Customer } from '#shared/types/customer';

const { isCustomerFormOpen, editingCustomer, closeCustomerForm } = useCustomerForm();
const customerStore = useCustomerStore();

const createEmptyForm = (): Omit<Customer, "id" | "createdAt"> => ({
  commercial_name: "",
  street_name: "",
  house_number: "",
  postal_code: "",
  city: "",
});

const formData = ref<Omit<Customer, "id" | "createdAt">>(createEmptyForm());

watch(
  editingCustomer,
  (newCustomer) => {
    if (newCustomer) {
      const { id, createdAt, ...customerData } = newCustomer;
      formData.value = customerData;
    } else {
      formData.value = createEmptyForm();
    }
  },
  { immediate: true }
);

const fetchAddressDetails = async () => {
  if (formData.value.postal_code && formData.value.house_number) {
    try {
      const response = await $fetch(
        `/api/postcode?postcode=${formData.value.postal_code}&number=${formData.value.house_number}`
      );
      if (response) {
        formData.value.street_name = response.street;
        formData.value.city = response.city;
      }
    } catch (error) {
      console.error("Failed to fetch address details:", error);
    }
  }
};

const submitForm = async () => {
  if (editingCustomer.value) {
    await customerStore.updateCustomer(editingCustomer.value.id, formData.value);
  } else {
    await customerStore.addCustomer(formData.value);
  }
  closeCustomerForm();
};
</script>
