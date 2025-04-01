import { createRouter, createWebHistory } from 'vue-router'
import EditProjectView from '@/views/ProjectEditView.vue'
import ProjectListView from '@/views/ProjectListView.vue'
import StoryListView from '@/views/StoryListView.vue'
import TaskListView from '@/views/TaskListView.vue'
import TaskDetailView from '@/views/TaskDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'projects',
      component: ProjectListView,
    },

    {
      path: '/edit/:id',
      name: 'editProject',
      component: EditProjectView,
    },
    {
      path: '/stories',
      name: 'stories',
      component: StoryListView,
    },
    {
      path: '/story/:storyId/tasks',
      name: 'story-tasks',
      component: TaskListView,
    },
    {
      path: '/tasks/:taskId',
      name: 'task-details',
      component: TaskDetailView,
    },
  ],
})

export default router
