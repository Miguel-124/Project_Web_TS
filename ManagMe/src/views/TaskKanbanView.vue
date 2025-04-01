<template>
  <div class="container">
    <h1>Zadania – Tablica Kanban</h1>

    <div class="kanban-board">
      <div v-for="status in statuses" :key="status" class="kanban-column">
        <h2 class="kanban-title">{{ statusMap[status] }}</h2>
        <div class="kanban-cards">
          <div v-for="task in filteredTasks(status)" :key="task.id" class="kanban-card">
            <strong>{{ task.name }}</strong>
            <p>{{ task.description }}</p>
            <small>
              Priorytet: {{ task.priority }} | Szacowany czas: {{ task.estimatedTime }}h
            </small>

            <div class="kanban-actions">
              <router-link :to="`/tasks/${task.id}`" class="btn btn-edit">Szczegóły</router-link>
              <button v-if="task.status !== 'done'" @click="advanceStatus(task)" class="btn">
                ➡️ Dalej
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TaskService } from '@/services/TaskService'
import type { Task, TaskStatus } from '@/models/Task'
import { useActiveProject } from '@/composables/useActiveProject'

const taskService = new TaskService()
const { activeProjectId } = useActiveProject()

const tasks = ref<Task[]>([])
const statuses: TaskStatus[] = ['todo', 'in progress', 'done']

const statusMap = {
  todo: 'Do zrobienia',
  'in progress': 'W trakcie',
  done: 'Zrobione',
}

onMounted(() => {
  if (activeProjectId.value) {
    const all = taskService.getAll()
    tasks.value = all.filter((t) =>
      // bierzemy tylko zadania z historii, która należy do aktywnego projektu
      t.storyId.startsWith(activeProjectId.value!),
    )
  } else {
    alert('Nie wybrano aktywnego projektu')
  }
})

function filteredTasks(status: TaskStatus): Task[] {
  return tasks.value.filter((t) => t.status === status)
}

function advanceStatus(task: Task) {
  const nextStatus: Record<TaskStatus, TaskStatus> = {
    todo: 'in progress',
    'in progress': 'done',
    done: 'done',
  }

  const updatedTask = { ...task, status: nextStatus[task.status] }

  if (updatedTask.status === 'in progress' && !updatedTask.startedAt) {
    updatedTask.startedAt = new Date().toISOString()
  }

  if (updatedTask.status === 'done' && !updatedTask.finishedAt) {
    updatedTask.finishedAt = new Date().toISOString()
  }

  taskService.update(updatedTask)

  // Odśwież dane
  tasks.value = taskService.getAll().filter((t) => t.storyId.startsWith(activeProjectId.value!))
}
</script>

<style scoped>
.kanban-board {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.kanban-column {
  flex: 1;
  background-color: #1e1e1e;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.kanban-title {
  text-align: center;
  margin-bottom: 1rem;
  color: #60a5fa;
}

.kanban-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.kanban-card {
  background-color: #2a2a2a;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid #444;
}

.kanban-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
}
</style>
