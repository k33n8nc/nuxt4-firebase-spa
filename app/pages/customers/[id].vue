<template>
  <div>
    <div v-if="isLoading">Loading customer details...</div>
    <div v-else-if="customer">
      <div class="flex justify-end mb-4">
        <Button @click="openCustomerForm(customer)">Edit Customer</Button>
      </div>
      <h1 class="text-2xl font-bold">{{ customer.commercial_name }}</h1>
      <!-- Registrations will be displayed here later -->
    </div>
    <div v-else>
      <p>Customer not found.</p>
    </div>
    <NuxtLink to="/customers" class="mt-4 inline-block text-blue-500 hover:underline">Back to Customers</NuxtLink>
    <CustomerForm />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useCustomerStore, type Customer } from '~/stores/customerStore';
import { useRoute } from 'vue-router';
import CustomerForm from '~/components/CustomerForm.vue';
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
