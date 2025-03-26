import { createRouter, createWebHistory } from 'vue-router'
import EditProjectView from '@/views/EditProject.vue'
import ProjectListView from '@/views/ProjectListView.vue'

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
  ],
})

export default router
