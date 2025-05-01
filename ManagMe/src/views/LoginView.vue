<template>
  <div class="container">
    <h1>Logowanie</h1>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Login" required class="input" />
      <input v-model="password" type="password" placeholder="Hasło" required class="input" />
      <button type="submit" class="btn">Zaloguj</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Google Login Button -->
    <div
      id="g_id_onload"
      data-client_id="335690842092-a73jf8ip34uugetkqut8jmim3aln2u9j.apps.googleusercontent.com"
      data-context="signin"
      data-ux_mode="popup"
      data-callback="handleCredentialResponse"
      data-auto_select="true"
      data-itp_support="true"
    ></div>

    <div
      style="margin-top: 5%"
      class="g_id_signin"
      data-type="standard"
      data-shape="pill"
      data-theme="outline"
      data-text="signin_with"
      data-size="large"
      data-logo_alignment="left"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

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

    if (!res.ok) {
      throw new Error('Błąd logowania')
    }

    const data = await res.json()
    authStore.setAuth(data.token, data.user, data.refreshToken)
    router.push('/')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd'
  }
}

// @ts-expect-error - global callback dla Google API
window.handleCredentialResponse = async (response: { credential: string }) => {
  try {
    const res = await fetch('http://localhost:3000/google-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: response.credential }),
    })

    if (!res.ok) {
      throw new Error('Błąd logowania Google')
    }

    const data = await res.json()
    authStore.setAuth(data.token, data.user, data.refreshToken)
    router.push('/')
  } catch (err) {
    alert('Błąd logowania Google')
    console.error(err)
  }
}
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
