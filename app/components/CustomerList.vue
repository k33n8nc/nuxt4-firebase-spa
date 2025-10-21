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
            <div class="flex justify-between items-center">
              <p class="text-lg mt-[1px]">{{ customer.commercial_name }}</p>
<!--              <span class="bg-green-600 rounded text-white text-sm px-2">ingepland op 10-04-2025</span>-->
<!--              <span class="bg-amber-600 rounded text-white text-sm px-2">uitgenodig op 10-02-2025</span>-->
            </div>

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
  let customers = customerStore.customers;

  // 1. Filter based on search query
  if (props.searchQuery) {
    const lowerCaseQuery = props.searchQuery.toLowerCase();
    customers = customers.filter(customer =>
      customer.commercial_name.toLowerCase().includes(lowerCaseQuery) ||
      customer.city.toLowerCase().includes(lowerCaseQuery)
    );
  }

  // 2. Sort the (filtered) list
  // Use slice() to create a shallow copy before sorting to avoid mutating the original store state
  return customers.slice().sort((a, b) => {
    const dateA = a.registrationExpireAlert;
    const dateB = b.registrationExpireAlert;

    // Push customers without a date to the end of the list
    if (dateA && !dateB) return -1;
    if (!dateA && dateB) return 1;
    if (!dateA && !dateB) return 0;

    // Sort ascending (oldest date first)
    return dateA.toMillis() - dateB.toMillis();
  });
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
