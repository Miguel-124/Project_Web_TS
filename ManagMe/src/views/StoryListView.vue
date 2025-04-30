<!-- views/StoryListView.vue -->
<template>
  <div>
    <h1>Historyjki projektu: {{ activeProject?.name }}</h1>
    <form @submit.prevent="addStory" v-if="hasRole('admin')" class="form-wrapper">
      <div class="form-fields">
        <input v-model="newStory.name" placeholder="Nazwa historyjki" required />
        <textarea
          v-model="newStory.description"
          placeholder="Opis historyjki"
          ref="textareaRef"
          @input="autoResize"
          rows="2"
        />
        <select v-model="newStory.priority" rows="3">
          <option value="low">Niski</option>
          <option value="medium">Średni</option>
          <option value="high">Wysoki</option>
        </select>
      </div>
      <button type="submit" class="btn btn-add">Dodaj</button>
    </form>

    <div class="form-label">
      <label for="priority-select">Priorytet: </label>
      <select id="priority-select" v-model="selectedPriority">
        <option value="all">Wszystkie</option>
        <option value="low">Niski</option>
        <option value="medium">Średni</option>
        <option value="high">Wysoki</option>
      </select>
    </div>
    <!-- Lista podzielona na statusy -->
    <div v-for="status in statuses" :key="status">
      <h2 style="margin-top: 1.5rem">{{ status.toUpperCase() }}</h2>
      <ul>
        <li v-for="story in filteredStories(status)" :key="story.id" class="project-item">
          <div class="project-details">
            <strong>{{ story.name }}</strong>
            <p>{{ story.description }}</p>
            <small>
              Priorytet: {{ story.priority }} | Autor: {{ getOwnerName() }} |
              {{ formatDate(story.createdAt) }}
            </small>
          </div>
          <div class="actions">
            <router-link :to="`/story/${story.id}/tasks`" class="btn btn-open">
              Zadania
            </router-link>
            <button
              v-if="story.status === 'todo'"
              class="btn btn-edit"
              @click="changeStatus(story, 'in progress')"
            >
              → Rozpocznij →
            </button>
            <button
              v-if="story.status === 'in progress'"
              class="btn btn-edit"
              @click="changeStatus(story, 'done')"
            >
              ✓ Zakończ ✓
            </button>
            <button
              v-if="story.status === 'done'"
              class="btn btn-edit"
              @click="changeStatus(story, 'todo')"
            >
              ⟲ Cofnij ⟲
            </button>
            <button @click="deleteStory(story.id)" v-if="hasRole('admin')" class="btn">Usuń</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import type { Story, StoryPriority, StoryStatus } from '@/models/Story'
import { StoryService } from '@/services/StoryService'
import { useActiveProject } from '@/composables/useActiveProject'
import { useAutoResizeTextarea } from '@/composables/useAutoResizeTextarea'
import { TaskService } from '@/services/TaskService'
import { useAuthStore } from '@/stores/authStore'
import { usePermissions } from '@/composables/usePermissions'

const { hasRole } = usePermissions()
const service = new StoryService()
const authStore = useAuthStore()
const currentUser = authStore.currentUser!
const { activeProject, activeProjectId } = useActiveProject()
const { textareaRef, autoResize } = useAutoResizeTextarea()
const router = useRouter()
const taskService = new TaskService()

const stories = ref<Story[]>([])
const newStory = ref({
  name: '',
  description: '',
  priority: 'medium' as StoryPriority,
})
const selectedPriority = ref<'all' | StoryPriority>('all')
const statuses: StoryStatus[] = ['todo', 'in progress', 'done']

onMounted(() => {
  if (!activeProjectId.value) {
    alert('Nie wybrano aktywnego projektu! Przejdź do listy projektów i wybierz jeden.')
    router.push('/') // przekieruj do listy projektów
    return
  }

  stories.value = service.getByProject(activeProjectId.value)
})

function addStory() {
  if (!activeProjectId.value) return

  service.create({
    name: newStory.value.name,
    description: newStory.value.description,
    priority: newStory.value.priority,
    projectId: activeProjectId.value,
    status: 'todo',
    ownerId: currentUser?.id ?? '',
  })

  stories.value = service.getByProject(activeProjectId.value)
  newStory.value = {
    name: '',
    description: '',
    priority: 'medium',
  }
  autoResize()
}

function deleteStory(id: string) {
  service.delete(id)
  taskService.deleteByStory(id) // 👈 nowa linia
  stories.value = service.getByProject(activeProjectId.value!)
}

function filteredStories(status: StoryStatus): Story[] {
  return stories.value.filter(
    (s) =>
      s.status === status &&
      (selectedPriority.value === 'all' || s.priority === selectedPriority.value),
  )
}

function getOwnerName(): string {
  return `${currentUser.firstName} ${currentUser.lastName}`
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString()
}

function changeStatus(story: Story, newStatus: StoryStatus) {
  const updatedStory = { ...story, status: newStatus }
  service.update(updatedStory)
  if (activeProjectId.value) {
    stories.value = service.getByProject(activeProjectId.value)
  }
}
</script>
