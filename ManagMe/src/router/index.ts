//router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import EditProjectView from '@/views/ProjectEditView.vue'
import ProjectListView from '@/views/ProjectListView.vue'
import StoryListView from '@/views/StoryListView.vue'
import TaskListView from '@/views/TaskListView.vue'
import TaskDetailView from '@/views/TaskDetailView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'projects',
      component: ProjectListView,
      meta: { requiresAuth: true },
    },
    {
      path: '/edit/:id',
      name: 'editProject',
      component: EditProjectView,
      meta: { requiresAuth: true },
    },
    {
      path: '/stories',
      name: 'stories',
      component: StoryListView,
      meta: { requiresAuth: true },
    },
    {
      path: '/story/:storyId/tasks',
      name: 'story-tasks',
      component: TaskListView,
      meta: { requiresAuth: true },
    },
    {
      path: '/tasks/:taskId',
      name: 'task-details',
      component: TaskDetailView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
  ],
})

export default router
