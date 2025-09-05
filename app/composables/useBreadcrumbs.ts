import { ref } from 'vue'
import type { Breadcrumb } from '#shared/types/breadcrumb'

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
