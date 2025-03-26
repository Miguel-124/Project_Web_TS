import { createRouter, createWebHistory } from 'vue-router'
import EditProjectView from '@/views/EditProject.vue'
import ProjectListView from '@/views/ProjectListView.vue'
import StoryListView from '@/views/StoryListView.vue'

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
      component: StoryListView
    }
  ],
})

export default router
