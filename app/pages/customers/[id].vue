<template>
  <div>
    <div class="flex justify-between items-center">
      <input type="text"
             placeholder="Search"
             class="h-10 px-2 flex-1 mr-4 border border-gray-300 rounded"
      >
      <Button @click="openCustomerForm(customer)">
        <Icon name="fa-solid:pen" />
      </Button>
    </div>
    <div v-if="isLoading">
      Loading customer details...
    </div>
    <RegistrationList v-else-if="customerId" :customer-id="customerId" />
    <div v-else>
      <p>Customer not found.</p>
    </div>
    <CustomerForm />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useCustomerStore } from '~/stores/customerStore';
import { useRoute } from 'vue-router';
import { useBreadcrumbs } from '~/composables/useBreadcrumbs';
import { useCustomerForm } from '~/composables/useCustomerForm';

const customerStore = useCustomerStore();
const route = useRoute();
const customerId = computed(() => Array.isArray(route.params.id) ? route.params.id[0] : route.params.id);

const customer = ref<Customer | null>(null);
const isLoading = ref(true);
const { setBreadcrumbs } = useBreadcrumbs();
const { openCustomerForm } = useCustomerForm();

watch(customerId, async (newId) => {
  if (newId) {
    isLoading.value = true;
    customer.value = null; // Reset customer on new ID
    customer.value = await customerStore.fetchCustomerById(newId);

    const crumbs = [
      { text: 'Dashboard', to: '/' },
      { text: 'Customers', to: '/customers' },
      { text: customer.value?.commercial_name || '', to: `/customers/${newId}` }
    ];
    setBreadcrumbs(crumbs);
    isLoading.value = false;
  }
}, { immediate: true });

definePageMeta({
  middleware: 'auth',
});
</script>
