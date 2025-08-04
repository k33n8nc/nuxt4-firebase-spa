<template>
  <div>
    <ThreeCards class="mb-12" :customer="customer" />
    <div class="flex justify-between items-center">
      <input type="text"
             placeholder="Search"
             class="h-10 px-2 flex-1 mr-4 border border-gray-300 rounded"
      >
    </div>
    <div v-if="isLoading">
      Loading customer details...
    </div>
    <RegistrationList v-else-if="customerId" :customer-id="customerId" />
    <div v-else>
      <p>Customer not found.</p>
    </div>
    <CustomerForm @customer-updated="refreshCustomerData" />
    <RegistrationForm />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomerStore } from '~/stores/customerStore';
import { useBreadcrumbs } from '~/composables/useBreadcrumbs';
import type { Customer } from '#shared/types/customer';
import RegistrationForm from '~/components/RegistrationForm.vue';

const customerStore = useCustomerStore();
const route = useRoute();
const customerId = computed(() => Array.isArray(route.params.id) ? route.params.id[0] : route.params.id);

const customer = ref<Customer | null>(null);
const isLoading = ref(true);
const { setBreadcrumbs } = useBreadcrumbs();

const loadCustomer = async () => {
  if (customerId.value) {
    isLoading.value = true;
    customer.value = await customerStore.fetchCustomerById(customerId.value);

    const crumbs = [
      { text: 'Dashboard', to: '/' },
      { text: 'Customers', to: '/customers' },
      { text: customer.value?.commercial_name || '' }
    ];
    setBreadcrumbs(crumbs);
    isLoading.value = false;
  }
};

const refreshCustomerData = async () => {
  if (customerId.value) {
    customer.value = await customerStore.fetchCustomerById(customerId.value);

    const crumbs = [
      { text: 'Dashboard', to: '/' },
      { text: 'Customers', to: '/customers' },
      { text: customer.value?.commercial_name || '' }
    ];
    setBreadcrumbs(crumbs);
  }
};

watch(customerId, loadCustomer, { immediate: true });

definePageMeta({
  middleware: 'auth',
});
</script>
