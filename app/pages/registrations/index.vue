<template>
  <div>
    <div class="mt-8">
      <div class="flex">
        <input type="text"
               placeholder="Search"
               class="h-10 px-2 flex-1 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
        >
      </div>
      <div v-if="isLoading">Loading registrations...</div>
      <div v-else-if="registrations.length === 0">No registrations found.</div>
      <div v-else class="mt-8">
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
          <tr v-for="registration in registrations" :key="registration.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ registration.registrationLabel ? registration.registrationLabel : registration.registrationId }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ registration.type }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ registration.volume }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ registration.validTo.toDate().toLocaleDateString('nl-NL', { year: 'numeric', month: '2-digit', day: '2-digit' }) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <SquareButton disabled @click="openRegistrationForm(registration)" class="!bg-gray-200 !cursor-not-allowed">
                <Icon name="fa-solid:pen" />
              </SquareButton>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <RegistrationForm />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRegistrationStore } from '~/stores/registrationStore';
import { useRegistrationForm } from '~/composables/useRegistrationForm';
import { useBreadcrumbs } from '~/composables/useBreadcrumbs';

definePageMeta({
  middleware: 'auth',
});

const { setBreadcrumbs } = useBreadcrumbs();
const registrationStore = useRegistrationStore();
const registrations = computed(() => registrationStore.registrations);
const isLoading = computed(() => registrationStore.isLoading);

const { openRegistrationForm } = useRegistrationForm();

onMounted(() => {
  registrationStore.fetchAllRegistrations();
});

setBreadcrumbs([
  { text: 'Dashboard', to: '/' },
  { text: 'Registrations', to: '/registrations' },
]);
</script>
