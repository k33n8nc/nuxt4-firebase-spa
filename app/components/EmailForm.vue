<template>
  <div v-if="isEmailFormOpen" class="fixed inset-0 z-40 bg-black/[var(--bg-opacity)] [--bg-opacity:50%]" @click.self="closeEmailForm">
    <div class="fixed top-0 right-0 h-full bg-white w-full md:w-120 shadow-lg z-50 overflow-y-auto">
      <div class="sticky top-0 bg-white flex justify-between items-center h-14 px-6 border-b border-gray-200 z-10">
        <h2 class="text-lg">Plan Inspection</h2>
        <SquareButton @click="closeEmailForm">
          <Icon name="fa-solid:times" />
        </SquareButton>
      </div>

      <!-- Email Form -->
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

      <!-- Email History -->
      <div v-if="currentCustomer" class="px-6 pt-6">
        <h3 class="text-md font-semibold mb-2">History</h3>
        <div v-if="emailHistory.length > 0">
          <table class="min-w-full divide-y divide-gray-200 text-sm">
            <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left font-medium text-gray-500">Status</th>
              <th class="px-4 py-2 text-left font-medium text-gray-500">Attempts</th>
              <th class="px-4 py-2 text-left font-medium text-gray-500">Finished At</th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="email in emailHistory" :key="email.delivery?.endTime?.toString() || email.sentAt?.toString()">
              <td class="px-4 py-2 whitespace-nowrap">{{ email.delivery?.state || 'PENDING' }}</td>
              <td class="px-4 py-2 whitespace-nowrap">{{ email.delivery?.attempts || 1 }}</td>
              <td class="px-4 py-2 whitespace-nowrap">{{ email.delivery?.endTime?.toDate().toLocaleString('nl-NL') || 'N/A' }}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-sm text-gray-500">No email history for this customer.</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useEmailForm } from '~/composables/useEmailForm';
import type { Email } from '#shared/types/email';
import { useNuxtApp } from '#app';
import { collection, addDoc, query, where, onSnapshot, orderBy, Timestamp, type Unsubscribe } from 'firebase/firestore';

const { isEmailFormOpen, currentCustomer, closeEmailForm } = useEmailForm();
const { $firestore } = useNuxtApp();

const formData = ref<Email>({ to: [''], message: { subject: '', text: '', html: '' } });
const emailHistory = ref<Email[]>([]);
let unsubscribe: Unsubscribe | null = null;

watch(currentCustomer, (newCustomer) => {
  // Unsubscribe from previous listener when customer changes
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
  emailHistory.value = [];

  if (newCustomer) {
    // Set up form data
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

    // Listen for email history in real-time
    const q = query(
        collection($firestore, 'mail'),
        where('customerId', '==', newCustomer.id),
        orderBy('sentAt', 'desc')
    );

    unsubscribe = onSnapshot(q, (querySnapshot) => {
      emailHistory.value = querySnapshot.docs.map(doc => doc.data() as Email);
    });
  }
});

const submitForm = async () => {
  if (!currentCustomer.value) return;

  const emailData: Email = {
    ...formData.value,
    customerId: currentCustomer.value.id,
    sentAt: Timestamp.now(),
  };

  try {
    await addDoc(collection($firestore, 'mail'), emailData);
    // The form is not closed automatically to allow the user to see the history update.
    // You can add closeEmailForm(); here if you prefer to close it.
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};
</script>
