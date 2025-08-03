import { ref } from 'vue'
import type { Registration } from '#shared/types/registration'

const isRegistrationFormOpen = ref(false)
const editingRegistration = ref<Registration | null>(null)

export function useRegistrationForm() {
  const openRegistrationForm = (registration: Registration | null = null) => {
    editingRegistration.value = registration
    isRegistrationFormOpen.value = true
  }

  const closeRegistrationForm = () => {
    isRegistrationFormOpen.value = false
    editingRegistration.value = null
  }

  return {
    isRegistrationFormOpen,
    editingRegistration,
    openRegistrationForm,
    closeRegistrationForm,
  }
}
