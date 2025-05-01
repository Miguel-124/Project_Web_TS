import './assets/base.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

import { useAuthStore } from '@/stores/authStore'
import { refreshTokenIfNeeded } from '@/composables/useTokenRefresher'

setInterval(() => {
  refreshTokenIfNeeded()
}, 50000)

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  //console.log('beforeEach triggered | requiresAuth:', requiresAuth, '| token:', authStore.token)

  if (requiresAuth && (!authStore.token || !authStore.currentUser)) {
    console.log(' Brak tokenu – przekierowanie do /login')
    next('/login')
  } else if (to.path === '/login' && authStore.token && authStore.currentUser) {
    console.log(' Już zalogowany – przekierowanie na /')
    next('/')
  } else {
    next()
  }
})

app.mount('#app')
