export type StoryStatus = 'todo' | 'in progress' | 'done'
export type StoryPriority = 'low' | 'medium' | 'high'

export class Story {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public status: StoryStatus,
    public priority: StoryPriority,
    public createdAt: string,
    public projectId: string,
    public ownerId: string,
  ) {}
}

export type NewStory = Omit<Story, 'id' | 'createdAt'>
