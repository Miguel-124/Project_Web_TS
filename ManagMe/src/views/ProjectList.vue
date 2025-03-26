<template>
  <div class="container">
    <h1 class="text-2xl font-bold mb-4">Projekty</h1>

    <!-- Formularz -->
    <form @submit.prevent="addProject" class="form-wrapper">
      <div class="form-fields">
        <input v-model="newProject.name" placeholder="Nazwa projektu" required />
        <textarea
          v-model="newProject.description"
          placeholder="Opis projektu"
          ref="textareaRef"
          @input="autoResize"
          rows="2"
        />
      </div>
      <button type="submit">Dodaj projekt</button>
    </form>

    <!-- Lista projektów -->
    <ul>
      <li v-for="project in projects" :key="project.id" class="project-item">
        <div class="project-details">
          <strong>{{ project.name }}</strong>
          <p>{{ project.description }}</p>
        </div>
        <div class="actions">
          <router-link :to="`/edit/${project.id}`" class="edit-btn">Edytuj</router-link>
          <button @click="deleteProject(project.id)">Usuń</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Project } from '@/models/Project'
import { useProjectService } from '@/composables/useProjectService'
import type { NewProject } from '@/models/Project'
import { useAutoResizeTextarea } from '@/composables/useAutoResizeTextarea'

const { textareaRef, autoResize } = useAutoResizeTextarea()
const service = useProjectService()

// Reaktywne dane
const projects = ref<Project[]>([])
const newProject = ref<NewProject>({
  name: '',
  description: '',
})

// Pobierz projekty przy starcie
onMounted(() => {
  projects.value = service.getAll()
})

// Dodawanie projektu
function addProject() {
  service.create({ ...newProject.value })
  projects.value = service.getAll()
  newProject.value = { name: '', description: '' }
}

// Usuwanie projektu
function deleteProject(id: string) {
  service.delete(id)
  projects.value = service.getAll()
}
</script>
