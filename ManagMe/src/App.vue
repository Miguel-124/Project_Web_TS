<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const darkMode = ref(false)

onMounted(() => {
  document.documentElement.classList.toggle('dark', darkMode.value)
})

watch(darkMode, (enabled) => {
  document.documentElement.classList.toggle('dark', enabled)
})
</script>

<template>
  <div :class="['app-wrapper', darkMode ? 'dark-mode' : 'light-mode']">
    <div class="container py-3">
      <div class="text-end mb-3">
        <button @click="darkMode = !darkMode" class="btn btn-outline-secondary">
          Tryb: {{ darkMode ? 'Ciemny' : 'Jasny' }}
        </button>
      </div>

      <router-view :key="$route.path + JSON.stringify($route.params)" />
    </div>
  </div>
</template>

<style>
.app-wrapper.light-mode {
  background-color: #f8f9fa;
  color: #212529;
  min-height: 100vh;
}

.app-wrapper.dark-mode {
  background-color: #121212;
  color: #f1f1f1;
  min-height: 100vh;
}
</style>
