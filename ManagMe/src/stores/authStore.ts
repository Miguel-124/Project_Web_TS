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

  // PRZYWRACANIE z localStorage przy starcie
  const savedUser = localStorage.getItem('currentUser')
  if (savedUser) {
    currentUser.value = JSON.parse(savedUser)
  }

  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))

  function setAuth(
    newToken: string,
    user: { id: string; username: string; firstName: string; lastName: string; role: string },
    newRefreshToken: string,
  ) {
    token.value = newToken
    currentUser.value = user
    refreshToken.value = newRefreshToken
    localStorage.setItem('token', newToken)
    localStorage.setItem('currentUser', JSON.stringify(user))
    localStorage.setItem('refreshToken', newRefreshToken)
  }

  function logout() {
    token.value = null
    refreshToken.value = null
    currentUser.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('currentUser')
  }

  return {
    token,
    refreshToken,
    currentUser,
    setAuth,
    logout,
  }
})
