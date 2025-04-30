// stores/authStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))

  const currentUser = ref<{
    id: string
    username: string
    firstName: string
    lastName: string
    role: string
  } | null>(JSON.parse(localStorage.getItem('currentUser') || 'null'))

  // ⬇️ PRZYWRACANIE z localStorage przy starcie
  const savedUser = localStorage.getItem('currentUser')
  if (savedUser) {
    currentUser.value = JSON.parse(savedUser)
  }

  function setAuth(
    newToken: string,
    user: { id: string; username: string; firstName: string; lastName: string; role: string },
  ) {
    token.value = newToken
    currentUser.value = user
    localStorage.setItem('token', newToken)
    localStorage.setItem('currentUser', JSON.stringify(user))
  }

  function logout() {
    token.value = null
    currentUser.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser')
  }

  return {
    token,
    currentUser,
    setAuth,
    logout,
  }
})
