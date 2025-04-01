<template>
  <div>
    <h1>Zadania projektu</h1>
    <form @submit.prevent="addTask" class="form-wrapper">
      <div class="form-fields">
        <input v-model="newTask.name" placeholder="Nazwa zadania" required />
        <textarea
          v-model="newTask.description"
          placeholder="Opis zadania"
          ref="textareaRef"
          @input="autoResize"
          rows="2"
        />
        <select v-model="newTask.priority">
          <option value="low">Niski</option>
          <option value="medium">Średni</option>
          <option value="high">Wysoki</option>
        </select>
        <input
          v-model.number="newTask.estimatedTime"
          type="number"
          placeholder="Szacowany czas (h)"
          required
        />
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

    <div v-for="status in statuses" :key="status">
      <h2 style="margin-top: 1.5rem">{{ status.toUpperCase() }}</h2>
      <ul>
        <li v-for="task in filteredTasks(status)" :key="task.id" class="project-item">
          <div class="project-details">
            <strong>{{ task.name }}</strong>
            <p>{{ task.description }}</p>
            <small>
              Priorytet: {{ task.priority }} | Szacowany czas: {{ task.estimatedTime }}h | Dodano:
              {{ formatDate(task.createdAt) }}
            </small>
          </div>
          <div class="actions">
            <button @click="deleteTask(task.id)" class="btn">Usuń</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { Task, TaskPriority, TaskStatus } from '@/models/Task'
import { TaskService } from '@/services/TaskService'
import { useActiveProject } from '@/composables/useActiveProject'
import { useAutoResizeTextarea } from '@/composables/useAutoResizeTextarea'

const taskService = new TaskService()
const { activeProjectId } = useActiveProject()
const { textareaRef, autoResize } = useAutoResizeTextarea()
const router = useRouter()
const route = useRoute()
const storyId = route.params.storyId as string

const tasks = ref<Task[]>([])
const newTask = ref({
  name: '',
  description: '',
  priority: 'medium' as TaskPriority,
  estimatedTime: 1,
})

const selectedPriority = ref<'all' | TaskPriority>('all')
const statuses: TaskStatus[] = ['todo', 'in progress', 'done']

onMounted(() => {
  if (!activeProjectId.value) {
    alert('Nie wybrano aktywnego projektu!')
    router.push('/')
    return
  }

  tasks.value = taskService.getByStory(storyId)
})

function addTask() {
  if (!activeProjectId.value) return

  taskService.create({
    name: newTask.value.name,
    description: newTask.value.description,
    priority: newTask.value.priority,
    estimatedTime: newTask.value.estimatedTime,
    storyId: storyId,
    status: 'todo',
    createdAt: new Date().toISOString(),
  })

  tasks.value = taskService.getByStory(storyId)
  newTask.value = {
    name: '',
    description: '',
    priority: 'medium',
    estimatedTime: 1,
  }
  autoResize()
}

function deleteTask(id: string) {
  taskService.delete(id)
  tasks.value = taskService.getByStory(storyId)
}

function filteredTasks(status: TaskStatus): Task[] {
  return tasks.value.filter(
    (t) =>
      t.status === status &&
      (selectedPriority.value === 'all' || t.priority === selectedPriority.value),
  )
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString()
}
</script>
