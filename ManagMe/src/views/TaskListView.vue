<!-- view/TaskListView.vue -->
<template>
  <div class="container">
    <h1>Zadania dla historyjki: {{ story?.name }}</h1>
    <!-- Formularz dodawania zadania -->
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
          type="number"
          v-model.number="newTask.estimatedTime"
          placeholder="Szacowany czas (h)"
          min="1"
        />
      </div>
      <button type="submit" class="btn btn-add">Dodaj zadanie</button>
    </form>
    <div class="form-label" style="margin-top: -1.5rem">
      <label for="priority-filter">Filtruj po priorytecie:</label>
      <select id="priority-filter" v-model="selectedPriority" class="input">
        <option value="all">Wszystkie</option>
        <option value="low">Niski</option>
        <option value="medium">Średni</option>
        <option value="high">Wysoki</option>
      </select>
    </div>

    <!-- Widok Kanban -->
    <div class="kanban-board">
      <div v-for="status in statuses" :key="status" class="kanban-column" :data-status="status">
        <h2 class="kanban-title">{{ statusMap[status] }}</h2>

        <Draggable
          :list="filteredTasks(status)"
          group="tasks"
          item-key="id"
          class="kanban-cards"
          @end="onDragEnd"
        >
          <template #item="{ element: task }">
            <div class="kanban-card" :data-id="task.id" :class="`priority-${task.priority}`">
              <strong>{{ task.name }}</strong>
              <p>{{ task.description }}</p>
              <small> Priorytet: {{ task.priority }} | Czas: {{ task.estimatedTime }}h </small>
              <p v-if="task.assignedUserId">
                <small>Przypisany: {{ getUserName(task.assignedUserId) }}</small>
              </p>
              <div class="kanban-actions">
                <router-link :to="`/tasks/${task.id}`" class="btn btn-edit">
                  Szczegóły
                </router-link>
              </div>
            </div>
          </template>
        </Draggable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable'
import type { SortableEvent } from 'sortablejs'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { TaskService } from '@/services/TaskService'
import type { Task, TaskStatus, TaskPriority, NewTask } from '@/models/Task'
import { useAutoResizeTextarea } from '@/composables/useAutoResizeTextarea'
import { useStoryService } from '@/composables/useStoryService'
import { useUserList } from '@/composables/useUserList'
import { useAuthStore } from '@/stores/authStore'

const { textareaRef, autoResize } = useAutoResizeTextarea()
const taskService = new TaskService()
const route = useRoute()
const storyId = route.params.storyId.toString()
const tasks = ref<Task[]>([])
const { getById } = useStoryService()
const story = getById(storyId)
const { users } = useUserList()
const authStore = useAuthStore()
const currentUser = authStore.currentUser

// 🔸 Typ lokalny – tylko dane z formularza
const newTask = ref<{
  name: string
  description: string
  priority: TaskPriority
  estimatedTime: number
}>({
  name: '',
  description: '',
  priority: 'medium',
  estimatedTime: 1,
})

const selectedPriority = ref<'all' | TaskPriority>('all')
const statuses: TaskStatus[] = ['todo', 'in progress', 'done']
const statusMap: Record<TaskStatus, string> = {
  todo: 'Do zrobienia',
  'in progress': 'W trakcie',
  done: 'Zrobione',
}

onMounted(() => {
  tasks.value = taskService.getByStoryId(storyId)
})

// ✅ Budowanie pełnego obiektu NewTask przy tworzeniu
function addTask() {
  const taskToCreate: NewTask = {
    ...newTask.value,
    storyId,
    status: 'todo',
    createdAt: new Date().toISOString(),
  }

  taskService.create(taskToCreate)
  tasks.value = taskService.getByStoryId(storyId)

  newTask.value = {
    name: '',
    description: '',
    priority: 'medium',
    estimatedTime: 1,
  }

  autoResize()
}

function filteredTasks(status: TaskStatus): Task[] {
  return tasks.value.filter(
    (t) =>
      t.status === status &&
      (selectedPriority.value === 'all' || t.priority === selectedPriority.value),
  )
}

function onDragEnd(event: SortableEvent) {
  const { item, to } = event

  // znajdź kolumnę (status) docelową
  const newStatusColumn = (to as HTMLElement).closest('.kanban-column')
  if (!newStatusColumn || !item) return

  const newStatus = newStatusColumn.getAttribute('data-status')
  const taskId = item.getAttribute('data-id')

  if (!newStatus || !taskId) return

  const movedTask = tasks.value.find((t) => t.id.toString() === taskId)

  if (movedTask && movedTask.status !== newStatus) {
    movedTask.status = newStatus as TaskStatus

    // przypisz użytkownika, jeśli przechodzi do "in progress" bez przypisanego
    if (newStatus === 'in progress') {
      if (!movedTask.startedAt) {
        movedTask.startedAt = new Date().toISOString()
      }
      if (!movedTask.assignedUserId) {
        if (currentUser) {
          movedTask.assignedUserId = currentUser.id
        }
      }
    }

    // zakończone? ustaw datę zakończenia
    if (newStatus === 'done' && !movedTask.finishedAt) {
      movedTask.finishedAt = new Date().toISOString()
    }

    taskService.update(movedTask)
  }
}

function getUserName(userId: string): string {
  const user = users.value.find((u) => u.id === userId)
  return user ? `${user.firstName} ${user.lastName} (${user.role})` : 'nieprzypisany'
}
</script>

<style scoped>
.kanban-board {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-top: 2rem;
}

.kanban-column {
  flex: 1;
  background-color: var(--color-background-mute);
  color: var(--color-text);
  border: 1px solid var(--color-border);
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
  background-color: var(--color-background-mute);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  padding: 1rem;
  border-radius: 0.75rem;
}

.kanban-actions {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
}

.priority-low {
  /* border: 1px solid #22c55e;  */
  box-shadow: 0 0 10px 1px #22c55e;
}

.priority-medium {
  /* border: 1px solid #facc15; żółty */
  box-shadow: 0 0 10px 1px #facc15;
}

.priority-high {
  /* border: 1px solid #ef4444; czerwony */
  box-shadow: 0 0 10px 1px #ef4444;
}
</style>
