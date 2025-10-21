<template>
  <div v-if="isRegistrationFormOpen" class="fixed inset-0 z-40 bg-black/[var(--bg-opacity)] [--bg-opacity:50%]" @click.self="closeRegistrationForm">
    <div class="fixed top-0 right-0 h-full bg-white w-full md:w-120 shadow-lg z-50">
      <div class="flex justify-between items-center bg-white h-14 px-6 border-b border-gray-200">
        <h2 class="text-lg">{{ editingRegistration ? 'Edit Registration' : 'Add Registration' }}</h2>
        <SquareButton @click="closeRegistrationForm" class="">
          <Icon name="fa-solid:times" />
        </SquareButton>
      </div>
      <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4 px-6 py-8">
        <div>
          <label for="registrationId" class="block text-sm text-gray-400">Registration ID</label>
          <input type="text" id="registrationId" v-model="formData.registrationId" required
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-800" />
        </div>
        <div>
          <label for="registrationLabel" class="block text-sm text-gray-400">Registration label</label>
          <input type="text" id="registrationLabel" v-model="formData.registrationLabel"
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-800" />
        </div>
        <div>
          <label for="type" class="block text-sm text-gray-400">Type</label>
          <input type="text" id="type" v-model="formData.type" required
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-800" />
        </div>
        <div>
          <label for="volume" class="block text-sm text-gray-400">Volume</label>
          <input type="number" id="volume" v-model="formData.volume" required
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-800" />
        </div>
        <div>
          <label for="year" class="block text-sm text-gray-400">Year</label>
          <input type="number" id="year" v-model="formData.year" required
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-800" />
        </div>

        <div>
          <label for="validTo" class="block text-sm text-gray-400">Valid to</label>
          <input type="date" id="validTo" v-model="validToDateString" required
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-800" />
        </div>

        <div class="col-span-2 flex justify-between mt-4">
        <SquareButton v-if="editingRegistration" @click="removeRegistration" type="button" class="bg-red-500 hover:bg-red-700 mr-3">
          <Icon name="fa-solid:trash" />
        </SquareButton>
        <SquareButton type="submit" class="w-full">
          {{ editingRegistration ? 'Update Registration' : 'Add Registration' }}
        </SquareButton>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRegistrationForm } from '~/composables/useRegistrationForm';
import { Timestamp } from 'firebase/firestore';
import type { Registration } from '#shared/types/registration';
import { computed } from 'vue';

const { isRegistrationFormOpen, editingRegistration, closeRegistrationForm } = useRegistrationForm();
const registrationStore = useRegistrationStore();
const route = useRoute();
const customerId = route.params.id as string;

const createEmptyForm = (): Omit<Registration, "id"> => ({
  registrationId: "",
  customerId: `${customerId}`,
  registrationLabel: "",
  type: "",
  volume: 0,
  year: new Date().getFullYear(),
  validTo: Timestamp.fromDate(new Date()), // Default to today
});

const formData = ref<Omit<Registration, "id">>(createEmptyForm());

// Computed property to handle the date conversion
const validToDateString = computed({
  get() {
    // Convert Timestamp to YYYY-MM-DD string for the input
    if (formData.value.validTo && formData.value.validTo.toDate) {
      const date = formData.value.validTo.toDate();
      // Using UTC methods to avoid timezone issues
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return '';
  },
  set(value: string) {
    // Convert YYYY-MM-DD string from input back to a Timestamp
    // The value is already in UTC 'YYYY-MM-DD', so new Date() will parse it as UTC midnight.
    const date = new Date(value);
    formData.value.validTo = Timestamp.fromDate(date);
  }
});

watch(
  editingRegistration,
  (newRegistration) => {
    if (newRegistration) {
      // When editing, populate formData from the store
      const { id, ...registrationData } = newRegistration;
      formData.value = registrationData;
    } else {
      // When adding, use a fresh form
      formData.value = createEmptyForm();
    }
  },
  { immediate: true }
);

const submitForm = async () => {
  if (editingRegistration.value) {
    await registrationStore.updateRegistration(
        editingRegistration.value.customerId,
        editingRegistration.value.id,
        formData.value
    );
  } else {
    // For new registrations, customerId comes from route for now
    // Later: replace with selected customer from dropdown
    await registrationStore.addRegistration(customerId, formData.value);
  }
  formData.value = createEmptyForm();
  closeRegistrationForm();
};

const removeRegistration = async () => {
  if (editingRegistration.value) {
    await registrationStore.removeRegistration(
        editingRegistration.value.customerId,
        editingRegistration.value.id
    );
    closeRegistrationForm();
  }
};

</script>
