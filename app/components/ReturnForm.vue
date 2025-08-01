<template>
  <div class="p-6 border rounded-lg shadow-md bg-white">
    <h2 class="text-xl font-semibold mb-4 text-gray-800">Add New Return</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="store" class="block text-sm font-medium text-gray-700">Store</label>
        <input
            id="store"
            v-model="storeName"
            type="text"
            required
            placeholder="e.g., zalando.com"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        >
      </div>

      <div class="mb-4">
        <h3 class="text-md font-medium text-gray-700 mb-2">Items</h3>
        <div v-for="(item, index) in items" :key="item.id" class="flex items-center gap-2 mb-2">
          <input
              v-model="item.name"
              type="text"
              required
              placeholder="Item name"
              class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
          >
          <input
              v-model.number="item.price"
              type="number"
              required
              step="0.01"
              placeholder="Price"
              class="block w-40 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
          >
          <button type="button" @click="removeItem(index)" class="text-red-500 hover:text-red-700 font-bold text-2xl p-1 leading-none">&times;</button>
        </div>
        <Button @click="addItem" class="mt-2 !bg-gray-200 !text-gray-800 hover:!bg-gray-300 text-sm">Add Item</Button>
      </div>

      <div class="flex justify-end mt-6">
        <Button type="submit" :disabled="returnStore.isLoading || !isFormValid">
          {{ returnStore.isLoading ? 'Saving...' : 'Save Return' }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useReturnStore } from '~/stores/returnStore';
import type { ReturnItem } from '#shared/types/customerReturn';

const returnStore = useReturnStore();

// A simple helper to generate a temporary unique ID for v-for keys
const generateItemId = () => Math.random().toString(36).slice(2, 11);

const storeName = ref('');
const items = ref<ReturnItem[]>([
  { id: generateItemId(), name: '', price: 0 }
]);

const isFormValid = computed(() => {
  return storeName.value.trim() !== '' && items.value.every(item => item.name.trim() !== '' && item.price > 0);
});

const addItem = () => {
  items.value.push({ id: generateItemId(), name: '', price: 0 });
};

const removeItem = (index: number) => {
  if (items.value.length > 1) {
    items.value.splice(index, 1);
  }
};

const handleSubmit = async () => {
  if (!isFormValid.value) {
    alert('Please fill in all fields correctly.');
    return;
  }

  await returnStore.addReturn({
    store: storeName.value,
    items: items.value,
  });

  // Reset form
  storeName.value = '';
  items.value = [{ id: generateItemId(), name: '', price: 0 }];
};
</script>