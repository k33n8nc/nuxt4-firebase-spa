<template>
  <div>
    <div class="flex justify-between items-center">
      <input type="text"
             v-model="searchQuery"
             placeholder="Search by name or city..."
             class="h-10 px-2 mr-4 flex-1 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
      >
      <SquareButton @click="openCustomerForm()">
        <Icon name="fa-solid:plus" />
      </SquareButton>
    </div>
    <CustomerList :search-query="searchQuery" />
    <CustomerForm />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useBreadcrumbs } from '~/composables/useBreadcrumbs';
import { useCustomerForm } from '~/composables/useCustomerForm';

definePageMeta({
  middleware: 'auth',
});

const searchQuery = ref('');

const { setBreadcrumbs } = useBreadcrumbs();
const { openCustomerForm } = useCustomerForm();

setBreadcrumbs([
  { text: 'Dashboard', to: '/' },
  { text: 'Customers' },
]);
</script>
