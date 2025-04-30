<!-- views/ProjectListView.vue -->
<template>
  <div class="container">
    <h1 class="">Projekty</h1>
    <p class="user-info">
      Zalogowany jako:
      <strong>{{ currentUser?.firstName }} {{ currentUser?.lastName }}</strong> (rola:
      <em>{{ currentUser?.role }}</em
      >)
    </p>

    <!-- Formularz -->
    <form v-if="hasRole('admin')" @submit.prevent="addProject" class="form-wrapper">
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
      <button type="submit" class="btn btn-add">Dodaj projekt</button>
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
        <button @click="openProject(project.id)" class="btn btn-open">Otwórz projekt</button>
        <div class="actions" v-if="hasRole('admin')">
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
import { useActiveProject } from '@/composables/useActiveProject'
import { useRouter } from 'vue-router'
import { StoryService } from '@/services/StoryService'
import { TaskService } from '@/services/TaskService'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { usePermissions } from '@/composables/usePermissions'

const { hasRole } = usePermissions()
const authStore = useAuthStore()
const { currentUser } = storeToRefs(authStore)
const storyService = new StoryService()
const taskService = new TaskService()
const { textareaRef, autoResize } = useAutoResizeTextarea()
const service = useProjectService()
const { activeProjectId, setActive } = useActiveProject()
const router = useRouter()

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

function deleteProject(id: string) {
  taskService.deleteByProject(id)
  storyService.deleteByProject(id)
  service.delete(id)
  projects.value = service.getAll()
}

function openProject(projectId: string) {
  setActive(projectId)
  router.push('/stories')
}
</script>
