<template>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 mb-12">
    <!-- Customer Info Card -->
    <div class="shadow rounded">
      <div class="p-6 text-sm text-gray-700">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm font-medium">{{ customer?.city }}</p>
            <p class="text-lg">{{ customer?.commercial_name }}</p>
          </div>
          <SquareButton @click.prevent="openCustomerForm(customer)" :disabled="!customer">
            <Icon name="fa-solid:pen" />
          </SquareButton>
        </div>
      </div>
    </div>

    <!-- Registrations Card -->
    <div class="shadow rounded">
      <div class="p-6 text-sm text-gray-700">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm font-medium">Registrations</p>
            <p class="text-lg">{{ registrationCount }}</p>
          </div>
          <SquareButton @click.prevent="openRegistrationForm()" :disabled="!customer">
            <Icon name="fa-solid:plus" />
          </SquareButton>
        </div>
      </div>
    </div>

    <!-- Expiration Date Card -->
    <div class="shadow rounded">
      <div class="p-6 text-sm text-gray-700">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm font-medium">Expire date</p>
            <p class="text-lg">
              {{ customer?.registrationExpireAlert?.toDate().toLocaleDateString('nl-NL', { year: 'numeric', month: '2-digit', day: '2-digit' }) }}
            </p>
          </div>
          <SquareButton @click.prevent="openEmailForm(customer)" :disabled="!customer">
            <Icon name="fa-solid:calendar-day" />
          </SquareButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCustomerForm } from '~/composables/useCustomerForm';
import { useRegistrationForm } from '~/composables/useRegistrationForm';
import { useEmailForm } from '~/composables/useEmailForm';
import { useCustomerStore } from '~/stores/customerStore';
import { useRegistrationStore } from '~/stores/registrationStore';

const customerStore = useCustomerStore();
const { activeCustomer: customer } = storeToRefs(customerStore);

const { openCustomerForm } = useCustomerForm();
const { openRegistrationForm } = useRegistrationForm();
const { openEmailForm } = useEmailForm();

const registrationStore = useRegistrationStore();
const registrationCount = computed(() => registrationStore.registrations.length);
</script>
