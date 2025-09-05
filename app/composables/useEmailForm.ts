import { ref } from 'vue'
import type { Customer } from '#shared/types/customer'

const isEmailFormOpen = ref(false)
const currentCustomer = ref<Customer | null>(null)

export function useEmailForm() {
  const openEmailForm = (customer: Customer | null = null) => {
    currentCustomer.value = customer
    isEmailFormOpen.value = true
  }

  const closeEmailForm = () => {
    isEmailFormOpen.value = false
    currentCustomer.value = null
  }

  return {
    isEmailFormOpen,
    currentCustomer,
    openEmailForm,
    closeEmailForm,
  }
}
