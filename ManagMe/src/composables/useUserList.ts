import { ref, onMounted } from 'vue'
import type { User } from '@/models/User'

const users = ref<User[]>([])

export function useUserList() {
  onMounted(async () => {
    const res = await fetch('http://localhost:3000/users')
    const data = await res.json()
    users.value = data
  })

  return { users }
}
