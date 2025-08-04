<template>
  <div class="grid md:grid-cols-3 gap-4 mt-8">
    <div class="shadow rounded">
      <div class="p-6 text-sm text-gray-700">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm font-medium">{{ customer?.city }}</p>
            <p class="text-lg">{{ customer?.commercial_name }}</p>
          </div>
          <Button @click.prevent="openCustomerForm(customer)" :disabled="!customer">
            <Icon name="fa-solid:pen" />
          </Button>
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
          <Button @click.prevent="openRegistrationForm()" :disabled="!customer">
            <Icon name="fa-solid:plus" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useCustomerForm } from '~/composables/useCustomerForm';
import { useRegistrationForm } from '~/composables/useRegistrationForm';
import { useRegistrationStore } from '~/stores/registrationStore';
import type { Customer } from '#shared/types/customer';

const props = defineProps<{
  customer: Customer | null;
}>();

const { openCustomerForm } = useCustomerForm();
const { openRegistrationForm } = useRegistrationForm();

const registrationStore = useRegistrationStore();
const registrationCount = computed(() => registrationStore.registrations.length);
</script>
