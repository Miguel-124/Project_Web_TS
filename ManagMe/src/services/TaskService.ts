// services/TaskService.ts
import type { Task, NewTask } from '@/models/Task'
import { StoryService } from '@/services/StoryService'

export class TaskService {
  private storageKey = 'tasks'

  private getTasks(): Task[] {
    const data = localStorage.getItem(this.storageKey)
    return data ? JSON.parse(data) : []
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks))
  }

  public getAll(): Task[] {
    return this.getTasks()
  }

  getById(id: number): Task | null {
    return this.getTasks().find((task) => task.id === id.toString()) || null
  }

  public getByStoryId(storyId: string): Task[] {
    return this.getTasks().filter((t) => t.storyId === storyId)
  }

  public deleteByStory(storyId: string) {
    const tasks = this.getTasks().filter((task) => task.storyId !== storyId)
    localStorage.setItem(this.storageKey, JSON.stringify(tasks))
  }

  public deleteByProject(projectId: string) {
    const storyService = new StoryService()
    const stories = storyService.getByProject(projectId)
    const storyIdsToDelete = stories.map((story) => story.id)

    const tasks = this.getTasks().filter((task) => !storyIdsToDelete.includes(task.storyId))
    localStorage.setItem(this.storageKey, JSON.stringify(tasks))
  }

  public create(task: NewTask): void {
    const tasks = this.getTasks()
    const lastId = tasks.length > 0 ? Math.max(...tasks.map((t) => Number(t.id))) : 0
    const newTask: Task = {
      ...task,
      id: (lastId + 1).toString(),
      createdAt: new Date().toISOString(),
    }

    tasks.push(newTask)
    this.saveTasks(tasks)
  }

  public update(updated: Task): void {
    const tasks = this.getTasks().map((t) => (t.id === updated.id ? updated : t))
    this.saveTasks(tasks)
  }

  public delete(id: string): void {
    const tasks = this.getTasks().filter((t) => t.id !== id)
    this.saveTasks(tasks)
  }
}
