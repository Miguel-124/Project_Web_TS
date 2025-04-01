import { createRouter, createWebHistory } from 'vue-router'
import EditProjectView from '@/views/EditProject.vue'
import ProjectListView from '@/views/ProjectListView.vue'
import StoryListView from '@/views/StoryListView.vue'
import TaskListView from '@/views/TaskListView.vue'

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
      path: '/tasks',
      name: 'tasks',
      component: TaskListView,
    },
  ],
})

export default router
