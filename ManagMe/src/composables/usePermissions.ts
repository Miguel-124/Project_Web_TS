// composables/usePermissions.ts
import { useAuthStore } from '@/stores/authStore'

export function usePermissions() {
  const authStore = useAuthStore()

  function hasRole(...roles: string[]): boolean {
    return !!authStore.currentUser && roles.includes(authStore.currentUser.role)
  }

  return { hasRole }
}
