<template>
  <div>
    <div>

    </div>
    <CustomerList />
  </div>
</template>

<script setup lang="ts">
import CustomerForm from '~/components/CustomerForm.vue';
import CustomerList from '~/components/CustomerList.vue';
import { useBreadcrumbs } from '~/composables/useBreadcrumbs';

definePageMeta({
  middleware: 'auth',
});

const { setBreadcrumbs } = useBreadcrumbs();

setBreadcrumbs([
  { text: 'Dashboard', to: '/' },
  { text: 'Customers', to: '/customers' },
]);
</script>
