// services/StoryService.ts
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

  public deleteByProject(projectId: string) {
    const stories = this.getStories().filter((story) => story.projectId !== projectId)
    localStorage.setItem(this.storageKey, JSON.stringify(stories))
  }

  public create(story: NewStory): void {
    const stories = this.getStories()
    const lastId = stories.length > 0 ? Math.max(...stories.map((s) => Number(s.id))) : 0

    const newStory: Story = {
      ...story,
      id: (lastId + 1).toString(),
      createdAt: new Date().toISOString(),
    }

    stories.push(newStory)
    this.saveStories(stories)
  }

  public update(updated: Story): void {
    let stories = this.getStories()
    stories = stories.map((s) => (s.id === updated.id ? updated : s))
    this.saveStories(stories)
  }

  public delete(id: string): void {
    let stories = this.getStories()
    stories = stories.filter((s) => s.id !== id)
    this.saveStories(stories)
  }
}
