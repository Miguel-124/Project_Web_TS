import type { User } from '@/models/User'
import { ref } from 'vue'

const currentUser = ref<User>({
  id: '1',
  firstName: 'Jan',
  lastName: 'Kowalski'
})

export function useCurrentUser() {
  return currentUser
}
