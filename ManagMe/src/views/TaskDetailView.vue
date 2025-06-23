<!-- view/TaskDetailView.vue -->
<template>
  <div class="container">
    <h1>Szczegóły zadania</h1>

    <div v-if="task">
      <template v-if="isEditing">
        <label>Nazwa:</label>
        <input v-model="task.name" class="input" />

        <label>Opis:</label>
        <textarea v-model="task.description" class="textarea" rows="2" />

        <label>Priorytet:</label>
        <select v-model="task.priority" class="input">
          <option value="low">Niski</option>
          <option value="medium">Średni</option>
          <option value="high">Wysoki</option>
        </select>

        <label>Szacowany czas (h):</label>
        <input type="number" v-model.number="task.estimatedTime" min="1" class="input" />
      </template>

      <template v-else>
        <p><strong>Nazwa:</strong> {{ task.name }}</p>
        <p><strong>Opis:</strong> {{ task.description }}</p>
        <p><strong>Priorytet:</strong> {{ task.priority }}</p>
        <p><strong>Status:</strong> {{ task.status }}</p>
        <p><strong>Szacowany czas:</strong> {{ task.estimatedTime }}h</p>
      </template>

      <p><strong>Data dodania:</strong> {{ formatDate(task.createdAt) }}</p>
      <p v-if="task.startedAt"><strong>Data startu:</strong> {{ formatDate(task.startedAt) }}</p>
      <p v-if="task.finishedAt">
        <strong>Data zakończenia:</strong> {{ formatDate(task.finishedAt) }}
      </p>
      <div>
        <label><strong>Przypisany użytkownik:</strong></label>
        <template v-if="isEditing">
          <select v-model="task.assignedUserId" class="input">
            <option value="">Brak</option>
            <option v-for="user in assignableUsers" :key="user.id" :value="user.id">
              {{ user.firstName }} {{ user.lastName }} ({{ user.role }})
            </option>
          </select>
        </template>
        <template v-else>
          <p v-if="task.assignedUserId">
            {{ getUserInfo(task.assignedUserId) }}
          </p>
          <p v-else>Nieprzypisany</p>
        </template>
      </div>

      <!-- Jeśli status to TODO – przypisz użytkownika -->
      <div v-if="task.status === 'todo'">
        <label for="assign">Przypisz użytkownika:</label>
        <select id="assign" v-model="selectedUserId" class="input">
          <option v-for="user in assignableUsers" :key="user.id" :value="user.id">
            {{ user.firstName }} {{ user.lastName }} ({{ user.role }})
          </option>
        </select>
      </div>

      <!-- Task actions: zakończ, edytuj, zapisz, usuń -->
      <div class="task-actions">
        <button v-if="task.status === 'todo'" @click="assignUser" class="btn btn-open">
          Rozpocznij zadanie
        </button>

        <!-- Zakończ zadanie (jeśli w trakcie) -->
        <button v-if="task.status === 'in progress'" @click="markAsDone" class="btn btn-open">
          Zakończ zadanie
        </button>

        <!-- Edytuj -->
        <button
          v-if="!isEditing && (task.status === 'todo' || task.status === 'in progress')"
          @click="isEditing = true"
          class="btn btn-edit"
        >
          Edytuj
        </button>

        <!-- Zapisz -->
        <button v-if="isEditing" @click="saveChanges" class="btn btn-save">Zapisz</button>

        <!-- Usuń -->
        <button
          v-if="task.status === 'todo' || task.status === 'in progress'"
          @click="deleteTask"
          class="btn btn-delete"
        >
          Usuń
        </button>
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
const isEditing = ref(false)
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

function getUserInfo(userId: string): string {
  const user = users.value.find((u) => u.id === userId)
  return user ? `${user.firstName} ${user.lastName} (${user.role})` : 'Nieznany użytkownik'
}

function markAsDone() {
  if (!task.value) return

  task.value.status = 'done'
  task.value.finishedAt = new Date().toISOString()

  taskService.update(task.value)
  alert('Zadanie zakończone!')
}

function saveChanges() {
  if (!task.value) return

  taskService.update(task.value)
  isEditing.value = false
  alert('Zadanie zapisane!')
}

function deleteTask() {
  if (!task.value) return

  taskService.delete(task.value.id)
  alert('Zadanie usunięte!')
  router.push(`/story/${task.value.storyId}/tasks`)
}
</script>
<style scoped>
.btn {
  margin: 5px;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
