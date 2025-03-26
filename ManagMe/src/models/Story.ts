export type StoryStatus = 'todo' | 'doing' | 'done'
export type StoryPriority = 'low' | 'medium' | 'high'

export interface Story {
  id: string
  name: string
  description: string
  status: StoryStatus
  priority: StoryPriority
  createdAt: string
  projectId: string
  ownerId: string
}

export type NewStory = Omit<Story, 'id' | 'createdAt'>
