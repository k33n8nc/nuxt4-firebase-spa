<template>
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
    <Button type="submit">{{ customer ? 'Update Customer' : 'Add Customer' }}</Button>
  </form>
</template>

<script setup lang="ts">

const props = defineProps({
  customer: {
    type: Object as () => Customer | null,
    default: null,
  },
});

const emit = defineEmits(["submit"]);

const customerStore = useCustomerStore();

const createEmptyForm = (): Omit<Customer, "id" | "createdAt"> => ({
  commercial_name: "",
  street_name: "",
  house_number: "",
  postal_code: "",
  city: "",
});

const formData = ref(createEmptyForm());

watch(
  () => props.customer,
  (newCustomer) => {
    if (newCustomer) {
      formData.value = { ...newCustomer };
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
  if (props.customer) {
    await customerStore.updateCustomer(props.customer.id, formData.value);
  } else {
    await customerStore.addCustomer(formData.value);
  }
  emit("submit");
};
</script>

