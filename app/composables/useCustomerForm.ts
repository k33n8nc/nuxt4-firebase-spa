import { ref } from 'vue'
import type { Customer } from '~/types'

const isCustomerFormOpen = ref(false)
const editingCustomer = ref<Customer | null>(null)

export function useCustomerForm() {
  const openCustomerForm = (customer: Customer | null = null) => {
    editingCustomer.value = customer
    isCustomerFormOpen.value = true
  }

  const closeCustomerForm = () => {
    isCustomerFormOpen.value = false
    editingCustomer.value = null
  }

  return {
    isCustomerFormOpen,
    editingCustomer,
    openCustomerForm,
    closeCustomerForm,
  }
}
