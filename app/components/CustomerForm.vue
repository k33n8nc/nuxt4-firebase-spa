<template>
  <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-2">
    <input v-model="formData.commercial_name"
           placeholder="Commercial Name"
           class="border border-gray-200 rounded py-2 px-3 col-span-2" />
    <input v-model="formData.postal_code"
           placeholder="Postal Code"
           class="border border-gray-200 rounded py-2 px-3"/>
    <input v-model="formData.house_number"
           placeholder="House Number"
           class="border border-gray-200 rounded py-2 px-3"/>
    <input v-model="formData.street_name"
           placeholder="Street Name"
           class="border border-gray-200 rounded py-2 px-3"/>
    <input v-model="formData.city"
           placeholder="City"
           class="border border-gray-200 rounded py-2 px-3"/>
    <Button type="submit">
      {{ isEditing ? 'Update Customer' : 'Add Customer' }}
    </Button>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useCustomerStore, type Customer } from '@/stores/customerStore';

const props = defineProps<{
  customer?: Customer | null;
}>();

const customerStore = useCustomerStore();

const isEditing = computed(() => !!props.customer);

// A single source of truth for a blank form state
const createEmptyForm = () => ({
  commercial_name: '',
  street_name: '',
  house_number: '',
  postal_code: '',
  city: '',
});

const formData = ref(createEmptyForm());

// Watch for prop changes to either populate the form for editing or reset it for creating
watch(() => props.customer, (newCustomer) => {
  if (newCustomer) {
    // When a customer prop is passed, populate the form with its data
    formData.value = {
      commercial_name: newCustomer.commercial_name,
      street_name: newCustomer.street_name,
      house_number: newCustomer.house_number,
      postal_code: newCustomer.postal_code,
      city: newCustomer.city,
    };
  } else {
    // When the prop is null or undefined, reset to a blank state
    formData.value = createEmptyForm();
  }
}, { immediate: true }); // immediate: true ensures this runs on component setup

const submitForm = async () => {
  if (!formData.value.commercial_name) {
    alert('Commercial name is required.');
    return;
  }

  if (isEditing.value && props.customer) {
    await customerStore.updateCustomer(props.customer.id, formData.value);
    alert('Customer updated!');
  } else {
    await customerStore.addCustomer(formData.value);
    // Reset form using the single source of truth
    formData.value = createEmptyForm();
  }
};
</script>
