<template>
  <div>
    <ThreeCards />
    <div class="flex justify-between items-center">
      <input type="text"
             placeholder="Search"
             class="h-10 px-2 flex-1 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
      >
    </div>
    <div v-if="isLoading">
      Loading customer details...
    </div>
    <RegistrationList v-else-if="customerId" :customer-id="customerId" />
    <div v-else>
      <p>Customer not found.</p>
    </div>
    <CustomerForm />
    <RegistrationForm />
    <EmailForm />
  </div>
</template>

<script setup lang="ts">
import { watch, computed, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomerStore } from '~/stores/customerStore';
import { useBreadcrumbs } from '~/composables/useBreadcrumbs';
import RegistrationForm from '~/components/RegistrationForm.vue';
import { storeToRefs } from 'pinia';

const customerStore = useCustomerStore();
const route = useRoute();

// Create a reactive reference to the store's state. `customer` will automatically update.
const { activeCustomer: customer } = storeToRefs(customerStore);

const customerId = computed(() => Array.isArray(route.params.id) ? route.params.id[0] : route.params.id);

const isLoading = computed(() => !customer.value && !!customerId.value);

const { setBreadcrumbs } = useBreadcrumbs();


// Watch for changes in the customer data (from the store) to update breadcrumbs
watch(customer, (newCustomer) => {
  setBreadcrumbs([
    { text: 'Dashboard', to: '/' },
    { text: 'Customers', to: '/customers' },
    { text: newCustomer?.commercial_name || '', to: '' }
  ]);
});

// Watch for changes in the route parameter to start listening to the correct customer
watch(customerId, (newId) => {
  if (newId) {
    customerStore.listenToCustomerById(newId);
  }
}, { immediate: true });

// Clean up the listener when the component is unmounted
onUnmounted(() => {
  customerStore.stopListeningToCustomer();
});



definePageMeta({
  middleware: 'auth',
});
</script>
