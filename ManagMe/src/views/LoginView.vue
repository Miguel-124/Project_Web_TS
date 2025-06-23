<template>
  <div class="container">
    <h1>Logowanie</h1>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Login" required class="input" />
      <input v-model="password" type="password" placeholder="Hasło" required class="input" />
      <button type="submit" class="btn">Zaloguj</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Kontener na przycisk Google -->
    <div id="google-signin-btn" style="margin-top: 5%"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// ===== Typy Google API =====
interface GoogleCredentialResponse {
  credential: string
}

interface GoogleAccountsId {
  initialize: (options: {
    client_id: string
    callback: (res: GoogleCredentialResponse) => void
  }) => void
  renderButton: (
    container: HTMLElement,
    options: {
      theme: string
      size: string
      shape: string
      text: string
      logo_alignment: string
    },
  ) => void
}

interface GoogleAccounts {
  accounts: {
    id: GoogleAccountsId
  }
}

declare global {
  interface Window {
    google: GoogleAccounts
    handleCredentialResponse: (response: GoogleCredentialResponse) => void
  }
}

// ===== Zmienne i logika lokalna =====
const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const authStore = useAuthStore()

async function login() {
  error.value = ''
  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })

    if (!res.ok) throw new Error('Błąd logowania')

    const data = await res.json()
    authStore.setAuth(data.token, data.user, data.refreshToken)
    router.push('/')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd'
  }
}

// ===== Logika Google Login =====
function handleCredentialResponse(response: GoogleCredentialResponse) {
  fetch('http://localhost:3000/google-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: response.credential }),
  })
    .then((res) => {
      if (!res.ok) throw new Error('Błąd logowania Google')
      return res.json()
    })
    .then((data) => {
      authStore.setAuth(data.token, data.user, data.refreshToken)
      router.push('/')
    })
    .catch((err) => {
      alert('Błąd logowania Google')
      console.error(err)
    })
}

onMounted(() => {
  window.handleCredentialResponse = handleCredentialResponse

  let attempts = 0
  const interval = setInterval(() => {
    const container = document.getElementById('google-signin-btn')
    const googleReady = window.google?.accounts?.id

    if (container && googleReady && container.childElementCount === 0) {
      window.google.accounts.id.initialize({
        client_id: '485046110075-evqncdgr6ae1qp98comc58thl6djjh7b.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      })

      window.google.accounts.id.renderButton(container, {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text: 'signin_with',
        logo_alignment: 'left',
      })

      clearInterval(interval)
    }

    if (++attempts > 25) clearInterval(interval) // 25 * 200ms = 5s
  }, 200)
})



</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 2rem auto;
  text-align: center;
}
.input {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem;
}
.btn {
  padding: 0.5rem 1rem;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>
