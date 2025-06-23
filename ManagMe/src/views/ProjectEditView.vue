<!-- views/EditProject.vue -->
<template>
  <div>
    <h1>Edytuj projekt</h1>
    <form @submit.prevent="updateProject" class="form-wrapper">
      <div class="form-fields">
        <input v-model="project.name" placeholder="Nazwa projektu" required />
        <textarea
          v-model="project.description"
          placeholder="Opis projektu"
          ref="textareaRef"
          @input="autoResize"
          rows="2"
        />
      </div>
      <button type="submit" class="btn btn-save">Zapisz zmiany</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Project } from '@/models/Project'
import { useProjectService } from '@/composables/useProjectService'
import { useAutoResizeTextarea } from '@/composables/useAutoResizeTextarea'

const { textareaRef, autoResize } = useAutoResizeTextarea()
const service = useProjectService()
const route = useRoute()
const router = useRouter()

const project = ref<Project>({
  id: '',
  name: '',
  description: '',
})

// Pobierz projekt po ID z URL
onMounted(() => {
  const id = route.params.id as string
  const existing = service.getById(id)
  if (existing) {
    project.value = { ...existing }
    autoResize()
  } else {
    alert('Nie znaleziono projektu')
    router.push('/')
  }
})

// Aktualizacja projektu
function updateProject() {
  service.update(project.value)
  router.replace('/')
}
</script>
