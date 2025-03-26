import { ProjectService } from '@/services/ProjectService'

export function useProjectService() {
  return new ProjectService('projects')
}
