// services/TaskService.ts
import type { Task, NewTask } from '@/models/Task'

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

  public getById(id: string): Task | undefined {
    return this.getTasks().find((t) => t.id === id)
  }

  public getByStory(storyId: string): Task[] {
    return this.getTasks().filter((s) => s.storyId === storyId)
  }

  public create(task: NewTask): void {
    const tasks = this.getTasks()
    const lastId = tasks.length > 0 ? Math.max(...tasks.map((t) => Number(t.id))) : 0

    const newTask: Task = {
      ...task,
      id: (lastId + 1).toString(),
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
