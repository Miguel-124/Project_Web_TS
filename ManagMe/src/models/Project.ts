export interface Project {
  id: string
  name: string
  description: string
}

export type NewProject = Omit<Project, 'id'>
