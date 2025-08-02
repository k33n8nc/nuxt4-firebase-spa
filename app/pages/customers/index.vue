<template>
  <div>
    <h1>Customers</h1>
    <div>
      <CustomerForm />
    </div>
    <CustomerList />
  </div>
</template>

<script setup lang="ts">
import CustomerForm from '~/components/CustomerForm.vue';
import CustomerList from '~/components/CustomerList.vue';

definePageMeta({
  middleware: 'auth',
});
</script>
