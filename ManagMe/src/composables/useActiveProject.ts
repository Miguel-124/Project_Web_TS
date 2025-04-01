import { ref, watch } from 'vue'
import { computed } from 'vue'
import { useProjectService } from '@/composables/useProjectService'
import type { Project } from '@/models/Project'

const STORAGE_KEY = 'activeProjectId'
const activeProjectId = ref<string | null>(localStorage.getItem(STORAGE_KEY))

watch(activeProjectId, (newId) => {
  if (newId) {
    localStorage.setItem(STORAGE_KEY, newId)
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
})

function setActive(id: string | null) {
  activeProjectId.value = id
}

const { getProjectById } = useProjectService()
const activeProject = computed<Project | null>(() => {
  const project = activeProjectId.value ? getProjectById(activeProjectId.value) : null
  return project ?? null
})

export function useActiveProject() {
  return {
    activeProjectId,
    activeProject,
    setActive,
  }
}
