import { ref, watch } from 'vue'

const STORAGE_KEY = 'activeProjectId'
const activeProjectId = ref<string | null>(localStorage.getItem(STORAGE_KEY))

watch(activeProjectId, (newId) => {
  if (newId) {
    localStorage.setItem(STORAGE_KEY, newId)
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
})

export function useActiveProject() {
  return {
    activeProjectId,
  }
}
