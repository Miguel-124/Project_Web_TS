import { User } from '@/models/User'
import { ref } from 'vue'

const currentUser = ref<User>(new User('1', 'Michał', 'Górecki'))
export function useCurrentUser() {
  return currentUser
}
