<template>
  <div>
    <div class="flex justify-end mb-4">
      <Button @click="openCustomerForm()">Add Customer</Button>
    </div>
    <CustomerList />
    <CustomerForm />
  </div>
</template>

<script setup lang="ts">
import CustomerList from '~/components/CustomerList.vue';
import CustomerForm from '~/components/CustomerForm.vue';
import { useBreadcrumbs } from '~/composables/useBreadcrumbs';
import { useCustomerForm } from '~/composables/useCustomerForm';

definePageMeta({
  middleware: 'auth',
});

const { setBreadcrumbs } = useBreadcrumbs();
const { openCustomerForm } = useCustomerForm();

setBreadcrumbs([
  { text: 'Dashboard', to: '/' },
  { text: 'Customers', to: '/customers' },
]);
</script>
