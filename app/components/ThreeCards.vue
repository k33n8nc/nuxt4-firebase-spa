<template>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
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

    <div class="shadow rounded">
      <div class="p-6 text-sm text-gray-700">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm font-medium">Contact customer</p>
            <p class="text-lg">Plan inspections</p>
          </div>
          <SquareButton @click.prevent="openEmailForm(customer)" :disabled="!customer">
            <Icon name="fa-solid:envelope" />
          </SquareButton>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useCustomerForm } from '~/composables/useCustomerForm';
import { useRegistrationForm } from '~/composables/useRegistrationForm';
import { useEmailForm } from '~/composables/useEmailForm';
import { useRegistrationStore } from '~/stores/registrationStore';
import type { Customer } from '#shared/types/customer';

const props = defineProps<{
  customer: Customer | null;
}>();

const { openCustomerForm } = useCustomerForm();
const { openRegistrationForm } = useRegistrationForm();
const { openEmailForm } = useEmailForm();

const registrationStore = useRegistrationStore();
const registrationCount = computed(() => registrationStore.registrations.length);
</script>
