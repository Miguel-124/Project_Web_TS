<!-- view/TaskDetailView.vue -->
<template>
  <div class="container">
    <h1>Szczegóły zadania</h1>

    <div v-if="task">
      <p><strong>Nazwa:</strong> {{ task.name }}</p>
      <p><strong>Opis:</strong> {{ task.description }}</p>
      <p><strong>Priorytet:</strong> {{ task.priority }}</p>
      <p><strong>Status:</strong> {{ task.status }}</p>
      <p><strong>Szacowany czas:</strong> {{ task.estimatedTime }}h</p>
      <p><strong>Data dodania:</strong> {{ formatDate(task.createdAt) }}</p>
      <p v-if="task.startedAt"><strong>Data startu:</strong> {{ formatDate(task.startedAt) }}</p>
      <p v-if="task.finishedAt">
        <strong>Data zakończenia:</strong> {{ formatDate(task.finishedAt) }}
      </p>

      <div v-if="task.status === 'todo'">
        <label for="assign">Przypisz użytkownika:</label>
        <select id="assign" v-model="selectedUserId">
          <option v-for="user in assignableUsers" :key="user.id" :value="user.id">
            {{ user.fullName }} ({{ user.role }})
          </option>
        </select>
        <button @click="assignUser" class="btn btn-edit">Rozpocznij zadanie</button>
      </div>

      <div v-else-if="task.status === 'in progress'">
        <button @click="markAsDone" class="btn btn-edit">Zakończ zadanie</button>
      </div>
    </div>

    <div v-else>
      <p>Nie znaleziono zadania.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TaskService } from '@/services/TaskService'
import { useUserList } from '@/composables/useUserList'
import type { Task } from '@/models/Task'

const route = useRoute()
const router = useRouter()
const taskService = new TaskService()

const task = ref<Task | null>(null)
const selectedUserId = ref('')
const { users } = useUserList()
const taskId = Number(route.params.taskId)

const assignableUsers = users.value.filter((u) => u.role === 'developer' || u.role === 'devops')

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString()
}

onMounted(() => {
  const found = taskService.getById(taskId)
  if (!found) {
    alert('Nie znaleziono zadania!')
    router.push('/')
    return
  }
  task.value = found
})

function assignUser() {
  if (!task.value || !selectedUserId.value) return

  task.value.status = 'in progress'
  task.value.assignedUserId = selectedUserId.value
  task.value.startedAt = new Date().toISOString()

  taskService.update(task.value)
  alert('Zadanie rozpoczęte!')
}

function markAsDone() {
  if (!task.value) return

  task.value.status = 'done'
  task.value.finishedAt = new Date().toISOString()

  taskService.update(task.value)
  alert('Zadanie zakończone!')
}
</script>
