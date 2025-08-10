<template>
  <div v-if="isCustomerFormOpen" class="fixed inset-0 z-40 bg-black/[var(--bg-opacity)] [--bg-opacity:50%]" @click.self="closeCustomerForm">
    <div class="fixed top-0 right-0 h-full bg-white w-full md:w-120 shadow-lg z-50">
      <div class="flex justify-between items-center bg-white h-14 px-6 border-b border-gray-200">
        <h2 class="text-lg">{{ editingCustomer ? 'Edit Customer' : 'Add Customer' }}</h2>
        <Button @click="closeCustomerForm" class="">
          <Icon name="fa-solid:times" />
        </Button>
      </div>
      <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4 px-6 py-8">
        <div class="col-span-2">
          <label for="commercial_name" class="block text-sm text-gray-400">Commercial Name</label>
          <input type="text" id="commercial_name" v-model="formData.commercial_name" required
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-800" />
        </div>
        <div>
          <label for="postal_code" class="block text-sm text-gray-400">Postal Code</label>
          <input type="text" id="postal_code" v-model="formData.postal_code" required
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-800" />
        </div>
        <div>
          <label for="house_number" class="block text-sm text-gray-400">House Number</label>
          <input type="text" id="house_number" v-model="formData.house_number" @blur="fetchAddressDetails" required
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-800" />
        </div>
        <div>
          <label for="street_name" class="block text-sm text-gray-400">Street Name</label>
          <input type="text" id="street_name" v-model="formData.street_name" required
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-800" />
        </div>
        <div>
          <label for="city" class="block text-sm text-gray-400">City</label>
          <input type="text" id="city" v-model="formData.city" required
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-800" />
        </div>
        <div class="col-span-2">
          <label for="email" class="block text-sm text-gray-400">Email</label>
          <input type="email" id="email" v-model="formData.email" required
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-800" />
        </div>
        <div class="col-span-2">
          <label for="phone" class="block text-sm text-gray-400">Phone</label>
          <input type="text" id="phone" v-model="formData.phone"
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-800" />
        </div>

        <div class="col-span-2 flex justify-between mt-4">
          <Button v-if="editingCustomer" @click="removeCustomer" type="button" class="bg-red-500 hover:bg-red-700 mr-3">
            <Icon name="fa-solid:trash" />
          </Button>
          <Button type="submit" class="w-full">
            {{ editingCustomer ? 'Update Customer' : 'Add Customer' }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerForm } from '~/composables/useCustomerForm';
import type { Customer } from '#shared/types/customer';

const emit = defineEmits(['customer-updated']);

const { isCustomerFormOpen, editingCustomer, closeCustomerForm } = useCustomerForm();
const customerStore = useCustomerStore();

const createEmptyForm = (): Omit<Customer, "id" | "createdAt" | "registrationExpireAlert"> => ({
  commercial_name: "",
  street_name: "",
  house_number: "",
  postal_code: "",
  city: "",
  email: "",
  phone: "",
});

const formData = ref<Omit<Customer, "id" | "createdAt" | "registrationExpireAlert">>(createEmptyForm());

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
  emit('customer-updated');
  formData.value = createEmptyForm();
  closeCustomerForm();
};

const removeCustomer = async () => {
  if (editingCustomer.value) {
    await customerStore.removeCustomer(editingCustomer.value.id);
    emit('customer-updated');
    closeCustomerForm();
    await navigateTo('/customers');
  }
};
</script>
