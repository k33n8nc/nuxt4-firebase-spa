<template>
  <div v-if="isRegistrationFormOpen" class="fixed inset-0 z-40 bg-black/[var(--bg-opacity)] [--bg-opacity:50%]" @click.self="closeRegistrationForm">
    <div class="fixed top-0 right-0 h-full bg-white w-96 shadow-lg p-6 z-50">
      <button @click="closeRegistrationForm" class="absolute top-4 right-4 text-gray-500 hover:text-gray-800">&times;</button>
      <h2 class="text-2xl font-bold mb-4">{{ editingRegistration ? 'Edit Registration' : 'Add Registration' }}</h2>
      <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4">
        <div class="col-span-2">
          <label for="registrationId" class="block text-sm font-medium text-gray-700">Registration ID</label>
          <input type="text" id="registrationId" v-model="formData.registrationId" required
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
          <input type="text" id="type" v-model="formData.type" required
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label for="volume" class="block text-sm font-medium text-gray-700">Volume</label>
          <input type="number" id="volume" v-model="formData.volume" required
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label for="year" class="block text-sm font-medium text-gray-700">Year</label>
          <input type="number" id="year" v-model="formData.year" required
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <Button type="submit">{{ editingRegistration ? 'Update Registration' : 'Add Registration' }}</Button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRegistrationForm } from '~/composables/useRegistrationForm';
import type { Registration } from '#shared/types/registration';

const { isRegistrationFormOpen, editingRegistration, closeRegistrationForm } = useRegistrationForm();
const registrationStore = useRegistrationStore();
const route = useRoute();
const customerId = route.params.id as string;

const createEmptyForm = (): Omit<Registration, "id"> => ({
  registrationId: "",
  type: "",
  volume: 0,
  year: new Date().getFullYear(),
});

const formData = ref<Omit<Registration, "id">>(createEmptyForm());

watch(
  editingRegistration,
  (newRegistration) => {
    if (newRegistration) {
      const { id, ...registrationData } = newRegistration;
      formData.value = registrationData;
    } else {
      formData.value = createEmptyForm();
    }
  },
  { immediate: true }
);

const submitForm = async () => {
  if (editingRegistration.value) {
    await registrationStore.updateRegistration(customerId, editingRegistration.value.id, formData.value);
  } else {
    await registrationStore.addRegistration(customerId, formData.value);
  }
  closeRegistrationForm();
};
</script>
