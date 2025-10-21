<template>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
    <div v-if="isLoading">Loading customers...</div>
    <div v-else-if="filteredCustomers.length === 0" class="col-span-full">
      No customers found.
    </div>
      <div v-else v-for="customer in filteredCustomers"
           :key="customer.id"
           class="shadow rounded"
      >
        <NuxtLink :to="{ name: 'customers-id', params: { id: customer.id } }">
          <div class="p-6 text-sm text-gray-700">
            <div class="flex justify-between">
              <p class="text-sm font-medium">
                <Icon name="fa-solid:map-marker-alt" class="mr-1 translate-y-[1.4px]" />
                {{ customer.city }}
              </p>
              <p class="text-sm font-medium">
                <Icon name="fa-solid:calendar-day" class="mr-1 translate-y-[1px]" />
                {{ customer.registrationExpireAlert?.toDate().toLocaleDateString('nl-NL', { year: 'numeric', month: '2-digit', day: '2-digit' }) }}
              </p>
            </div>
            <p class="text-lg mt-[1px]">{{ customer.commercial_name }}</p>
          </div>
        </NuxtLink>
      </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useCustomerStore } from '@/stores/customerStore';

const props = defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
});

const customerStore = useCustomerStore();
const isLoading = ref(false);

const filteredCustomers = computed(() => {
  if (!props.searchQuery) {
    return customerStore.customers;
  }
  const lowerCaseQuery = props.searchQuery.toLowerCase();
  return customerStore.customers.filter(customer =>
    customer.commercial_name.toLowerCase().includes(lowerCaseQuery) ||
    customer.city.toLowerCase().includes(lowerCaseQuery)
  );
});

// Fetch customers when the component is mounted
onMounted(async () => {
  isLoading.value = true;
  try {
    await customerStore.fetchCustomers();
  } catch (error) {
    console.error("Failed to fetch customers:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>
