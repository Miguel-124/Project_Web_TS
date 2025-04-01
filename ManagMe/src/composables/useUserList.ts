import { User } from '@/models/User'
import { ref } from 'vue'

const users = ref<User[]>([
  new User('1', 'Michał', 'Górecki', 'admin'),
  new User('2', 'Oskar', 'Brózda', 'devops'),
  new User('3', 'Ryszard', 'Brzegowy', 'developer'),
])

export function useUserList() {
  return { users }
}
