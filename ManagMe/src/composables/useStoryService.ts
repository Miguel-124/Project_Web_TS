import { StoryService } from '@/services/StoryService'

export function useStoryService() {
  const service = new StoryService()

  return {
    getAll: service.getAll.bind(service),
    getById: service.getById.bind(service),
    getByProject: service.getByProject.bind(service),
    create: service.create.bind(service),
    update: service.update.bind(service),
    delete: service.delete.bind(service),
    deleteByProject: service.deleteByProject.bind(service),
  }
}
