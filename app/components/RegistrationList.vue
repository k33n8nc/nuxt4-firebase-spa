<template>
  <div class="mt-8">
    <div v-if="isLoading">Loading registrations...</div>
    <div v-else-if="registrations.length === 0">No registrations found.</div>
    <div v-else>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration ID</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="registration in registrations" :key="registration.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ registration.registrationId }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ registration.type }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ registration.volume }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ registration.year }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRegistrationStore } from '@/stores/registrationStore';

const props = defineProps({
  customerId: {
    type: String,
    required: true,
  },
});

const registrationStore = useRegistrationStore();

const isLoading = computed(() => registrationStore.isLoading);
const registrations = computed(() => registrationStore.registrations);

onMounted(() => {
  if (props.customerId) {
    registrationStore.fetchRegistrations(props.customerId);
  }
});
</script>
