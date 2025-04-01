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
            <div class="kanban-card" :data-id="task.id">
              <strong>{{ task.name }}</strong>
              <p>{{ task.description }}</p>
              <small> Priorytet: {{ task.priority }} | Czas: {{ task.estimatedTime }}h </small>
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
import type { DragEndEvent } from 'sortablejs'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { TaskService } from '@/services/TaskService'
import type { Task, TaskStatus, TaskPriority, NewTask } from '@/models/Task'
import { useAutoResizeTextarea } from '@/composables/useAutoResizeTextarea'
import { useStoryService } from '@/composables/useStoryService'

const { textareaRef, autoResize } = useAutoResizeTextarea()
const taskService = new TaskService()
const route = useRoute()
const storyId = route.params.storyId.toString()
const tasks = ref<Task[]>([])
const { getById } = useStoryService()
const story = getById(storyId)

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
  return tasks.value.filter((t) => t.status === status)
}

function onDragEnd(event: DragEndEvent) {
  const { item, to } = event

  // znajdź kolumnę (status) docelową
  const newStatusColumn = to.closest('.kanban-column')
  if (!newStatusColumn) return

  const newStatus = newStatusColumn.getAttribute('data-status')
  if (!newStatus || !item) return

  const taskId = item.dataset.id
  const movedTask = tasks.value.find((t) => t.id.toString() === taskId)

  if (movedTask && movedTask.status !== newStatus) {
    movedTask.status = newStatus as TaskStatus

    // zaktualizuj daty
    if (newStatus === 'in progress' && !movedTask.startedAt) {
      movedTask.startedAt = new Date().toISOString()
    }
    if (newStatus === 'done' && !movedTask.finishedAt) {
      movedTask.finishedAt = new Date().toISOString()
    }

    taskService.update(movedTask)
  }
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
  justify-content: flex-end;
  margin-top: 0.5rem;
}
</style>
