<template>
  <div class="mt-8">
    <div v-if="isLoading">Loading registrations...</div>
    <div v-else-if="filteredRegistrations.length === 0" class="text-gray-500">
      No registrations found.
    </div>
    <div v-else>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration ID</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid to</th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="registration in filteredRegistrations" :key="registration.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ registration.registrationLabel ? registration.registrationLabel : registration.registrationId }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ registration.type }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ registration.volume }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ registration.validTo.toDate().toLocaleDateString('nl-NL', { year: 'numeric', month: '2-digit', day: '2-digit' }) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <SquareButton @click="openRegistrationForm(registration)">
                <Icon name="fa-solid:pen" />
              </SquareButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRegistrationStore } from '~/stores/registrationStore';
import { useRegistrationForm } from '~/composables/useRegistrationForm';

const props = defineProps({
  customerId: {
    type: String,
    required: false,
  },
  searchQuery: {
    type: String,
    default: '',
  },
});

const registrationStore = useRegistrationStore();
const { openRegistrationForm } = useRegistrationForm();

const isLoading = computed(() => registrationStore.isLoading);

const filteredRegistrations = computed(() => {
  let registrations = registrationStore.registrations;

  // 1. Filter based on search query
  if (props.searchQuery) {
    const lowerCaseQuery = props.searchQuery.toLowerCase();
    registrations = registrations.filter(registration => {
      const label = registration.registrationLabel?.toLowerCase() || '';
      const id = registration.registrationId?.toLowerCase() || '';
      return label.includes(lowerCaseQuery) || id.includes(lowerCaseQuery);
    });
  }

  // 2. Sort the (filtered) list by `validTo` date
  // Use slice() to create a shallow copy before sorting to avoid mutating the original store state
  return registrations.slice().sort((a, b) => {
    // Sort ascending (oldest date first)
    return a.validTo.toMillis() - b.validTo.toMillis();
  });
});

onMounted(() => {
  if (props.customerId) {
    registrationStore.fetchRegistrations(props.customerId);
  } else {
    registrationStore.fetchAllRegistrations();
  }
});
</script>
