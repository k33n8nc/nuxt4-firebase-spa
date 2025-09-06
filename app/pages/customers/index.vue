<template>
  <div>
    <div class="flex justify-between items-center">
      <input type="text"
             placeholder="Search"
             class="h-10 px-2 mr-4 flex-1 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
      >
      <SquareButton @click="openCustomerForm()">
        <Icon name="fa-solid:plus" />
      </SquareButton>
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
  { text: 'Customers' },
]);
</script>
