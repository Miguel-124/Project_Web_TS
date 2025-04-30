<!-- views/ProjectListView.vue -->
<template>
  <div class="container">
    <h1>Logowanie</h1>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Login" required class="input" />
      <input v-model="password" type="password" placeholder="Hasło" required class="input" />
      <button type="submit" class="btn">Zaloguj</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
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

    router.push('/') // przekieruj na stronę główną lub dashboard
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'Wystąpił nieoczekiwany błąd'
    }
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
