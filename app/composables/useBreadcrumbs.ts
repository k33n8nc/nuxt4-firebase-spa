import { ref } from 'vue'

export interface Breadcrumb {
  text: string
  to?: string
}

const breadcrumbs = ref<Breadcrumb[]>([])

export function useBreadcrumbs() {
  const setBreadcrumbs = (newBreadcrumbs: Breadcrumb[]) => {
    breadcrumbs.value = newBreadcrumbs
  }

  return {
    breadcrumbs,
    setBreadcrumbs,
  }
}
