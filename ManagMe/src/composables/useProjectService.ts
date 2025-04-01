import { ProjectService } from '@/services/ProjectService'

export function useProjectService() {
  const service = new ProjectService('projects')

  return {
    getAll: service.getAll.bind(service),
    getById: service.getProjectById.bind(service),
    create: service.create.bind(service),
    update: service.update.bind(service),
    delete: service.delete.bind(service),
  }
}
