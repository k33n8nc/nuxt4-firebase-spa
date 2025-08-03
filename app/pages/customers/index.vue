<template>
  <div>
    <div class="flex justify-between items-center">
      <input type="text" placeholder="Search" class="h-10 px-2 flex-1 mr-4 border border-gray-300 rounded">
      <Button @click="openCustomerForm()">
        <Icon name="fa-solid:plus" />
      </Button>
    </div>
    <CustomerList />
    <CustomerForm />
  </div>
</template>

<script setup lang="ts">
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
