// composables/useTokenRefresher.ts
import { useAuthStore } from '@/stores/authStore'

export async function refreshTokenIfNeeded() {
  const authStore = useAuthStore()
  const refreshToken = authStore.refreshToken

  if (!refreshToken || refreshToken === 'null') {
    console.warn('Brak refresh tokenu – pomijam odświeżanie.')
    return
  }

  try {
    const res = await fetch('http://localhost:3000/refreshToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    if (!res.ok) {
      throw new Error('Token refresh failed')
    }

    const data = await res.json()
    authStore.token = data.token
    authStore.refreshToken = data.refreshToken
    localStorage.setItem('token', data.token)
    localStorage.setItem('refreshToken', data.refreshToken)
  } catch (err) {
    console.error('Refresh token error:', err)

    // ⚠️ Nie wylogowuj, jeśli to użytkownik z Google (rola 'guest')
    if (authStore.currentUser?.role === 'guest') {
      console.warn('Google user – nie wylogowuję.')
      return
    }

    authStore.logout()
  }
}
