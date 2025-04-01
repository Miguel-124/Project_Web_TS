export type TaskStatus = 'todo' | 'in progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export class Task {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public status: TaskStatus,
    public priority: TaskPriority,
    public storyId: string,
    public estimatedTime: number,
    public createdAt: string,
    public startedAt?: string,
    public finishedAt?: string,
    public assignedUserId?: string,
  ) {}
}

new Task(
  't1',
  'Poprawić formularz',
  'Zmiana pola input',
  'todo',
  'medium',
  'story123',
  5,
  new Date().toISOString()
)

export type NewTask = Omit<Task, 'id'>
