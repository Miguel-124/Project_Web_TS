import { User } from '@/models/User'
import { ref } from 'vue'

const currentUser = ref<User>(new User('1', 'Michał', 'Górecki', 'admin'))

export function useCurrentUser() {
  return currentUser
}
