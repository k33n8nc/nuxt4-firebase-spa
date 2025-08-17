<template>
  <div v-if="isEmailFormOpen" class="fixed inset-0 z-40 bg-black/[var(--bg-opacity)] [--bg-opacity:50%]" @click.self="closeEmailForm">
    <div class="fixed top-0 right-0 h-full bg-white w-full md:w-120 shadow-lg z-50">
      <div class="flex justify-between items-center bg-white h-14 px-6 border-b border-gray-200">
        <h2 class="text-lg">Plan Inspection</h2>
        <SquareButton @click="closeEmailForm" class="">
          <Icon name="fa-solid:times" />
        </SquareButton>
      </div>
      <form v-if="currentCustomer" @submit.prevent="submitForm" class="grid grid-cols-2 gap-4 px-6 py-8">
        <div class="col-span-2">
          <label for="to" class="block text-sm text-gray-400">To</label>
          <input type="text" id="to" v-model="formData.to[0]" required disabled
                 class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-gray-800" />
        </div>
        <div class="col-span-2">
          <label for="subject" class="block text-sm text-gray-400">Subject</label>
          <input type="text" id="subject" v-model="formData.message.subject" required
                 class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-800" />
        </div>
        <div class="col-span-2">
          <label for="body" class="block text-sm text-gray-400">Body</label>
          <textarea id="body" v-model="formData.message.text" required rows="5"
                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-800" />
        </div>

        <div class="col-span-2 flex justify-between mt-4">
          <SquareButton type="submit" class="w-full">
            Send
          </SquareButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useEmailForm } from '~/composables/useEmailForm';
import type { Email } from '#shared/types/email';
import { useNuxtApp } from '#app';
import { collection, addDoc } from 'firebase/firestore';

const { isEmailFormOpen, currentCustomer, closeEmailForm } = useEmailForm();
const { $firestore } = useNuxtApp();

const formData = ref<Email>({ to: [''], message: { subject: '', text: '', html: '' } });

watch(currentCustomer, (newCustomer) => {
  if (newCustomer) {
    const formattedDate = newCustomer.registrationExpireAlert?.toDate().toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' });
    formData.value = {
      to: [newCustomer.email],
      message: {
        subject: 'Plan inspection before ' + `${formattedDate}`,
        text: 'Hi, ' + `${newCustomer.commercial_name}` + '\nWe would like to plan an inspection '
        + 'before ' + `${formattedDate}`
        + '. Please contact us to plan the inspection.',
        html: ''
      }
    };
  }
});

const submitForm = async () => {
  if (!currentCustomer.value) return;

  try {
    await addDoc(collection($firestore, 'mail'), formData.value);
    closeEmailForm();
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};
</script>
