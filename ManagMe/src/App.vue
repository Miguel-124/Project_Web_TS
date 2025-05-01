<script setup lang="ts">
import { ref, watchEffect, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const darkMode = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const { currentUser } = storeToRefs(authStore)

onMounted(() => {
  const saved = localStorage.getItem('darkMode')
  if (saved !== null) {
    darkMode.value = saved === 'true'
  } else {
    darkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})

watchEffect(() => {
  document.documentElement.classList.toggle('dark', darkMode.value)
  document.documentElement.classList.toggle('light', !darkMode.value)
  localStorage.setItem('darkMode', darkMode.value.toString())
})

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="top-bar">
    <button
      @click="darkMode = !darkMode"
      class="btn btn-toggle"
      style="
        text-align: left;
        background: var(--color-background-mute);
        color: var(--color-text);
        border: 1px solid var(--color-border);
      "
    >
      Tryb: {{ darkMode ? 'Ciemny' : 'Jasny' }}
    </button>
    <div v-if="currentUser">
      {{ currentUser.firstName }} {{ currentUser.lastName }} ({{ currentUser.role }})
    </div>
    <button
      @click="logout"
      class="btn btn-toggle"
      style="
        text-align: right;
        background: var(--color-background-mute);
        color: var(--color-text);
        border: 1px solid var(--color-border);
      "
    >
      Wyloguj
    </button>
  </div>

  <router-view :key="$route.path + JSON.stringify($route.params)" />
</template>

<style>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.btn-toggle {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  background: var(--color-background-mute);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  cursor: pointer;
}
</style>
