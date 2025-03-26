<template>
  <div class="container">
    <h1 class="">Projekty</h1>
    <p class="user-info">
      Zalogowany jako: <strong>{{ currentUser.firstName }} {{ currentUser.lastName }}</strong>
    </p>

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
      <div class="actions">
        <button type="submit" class="btn">Dodaj projekt</button>
        <router-link to="/stories" class="btn btn-edit" rows="2">Otwórz projekt</router-link>
      </div>
    </form>

    <!-- Lista projektów -->
    <ul>
      <li
        v-for="project in projects"
        :key="project.id"
        class="project-item"
        :class="{ active: project.id === activeProjectId }"
      >
        <div class="project-details">
          <strong>{{ project.name }}</strong>
          <p>{{ project.description }}</p>
        </div>
        <button
          @click="setActive(project.id)"
          :class="['btn-active', 'btn', { selected: project.id === activeProjectId }]"
        >
          Aktywny
        </button>
        <div class="actions">
          <router-link :to="`/edit/${project.id}`" class="btn btn-edit">Edytuj</router-link>
          <button @click="deleteProject(project.id)" class="btn">Usuń</button>
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
import { useCurrentUser } from '@/composables/useCurrentUser'
import { useActiveProject } from '@/composables/useActiveProject'

const currentUser = useCurrentUser()
const { textareaRef, autoResize } = useAutoResizeTextarea()
const service = useProjectService()
const { activeProjectId } = useActiveProject()

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

function setActive(id: string) {
  activeProjectId.value = id
}
</script>
