import type { Story, NewStory } from '@/models/Story'

export class StoryService {
  private storageKey = 'stories'

  private getStories(): Story[] {
    const data = localStorage.getItem(this.storageKey)
    return data ? JSON.parse(data) : []
  }

  private saveStories(stories: Story[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(stories))
  }

  public getAll(): Story[] {
    return this.getStories()
  }

  public getByProject(projectId: string): Story[] {
    return this.getStories().filter((s) => s.projectId === projectId)
  }

  public create(project: NewStory): void {
    const projects = this.getStories()
    const lastId = projects.length > 0 ? Math.max(...projects.map((p) => Number(p.id))) : 0

    const newProject: Story = {
      ...project,
      id: (lastId + 1).toString(),
      createdAt: new Date().toISOString(),
    }

    projects.push(newProject)
    this.saveStories(projects)
  }

  public update(updated: Story): void {
    let projects = this.getStories()
    projects = projects.map((p) => (p.id === updated.id ? updated : p))
    this.saveStories(projects)
  }

  public delete(id: string): void {
    let projects = this.getStories()
    projects = projects.filter((p) => p.id !== id)
    this.saveStories(projects)
  }
}
