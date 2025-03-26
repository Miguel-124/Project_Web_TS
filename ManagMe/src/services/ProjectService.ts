import type { Project, NewProject } from '@/models/Project'

export class ProjectService {
  private storageKey = 'projects';

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  private getProjects(): Project[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveProjects(projects: Project[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
  }

  public getAll(): Project[] {
    return this.getProjects();
  }

  public getById(id: string): Project | undefined {
    return this.getProjects().find((p) => p.id === id);
  }

  public create(project: NewProject): void {
    const projects = this.getProjects()
    const lastId = projects.length > 0
      ? Math.max(...projects.map(p => Number(p.id)))
      : 0

    const newProject: Project = {
      ...project,
      id: (lastId + 1).toString()
    }

    projects.push(newProject)
    this.saveProjects(projects)
  }

  public update(updated: Project): void {
    let projects = this.getProjects();
    projects = projects.map((p) => (p.id === updated.id ? updated : p));
    this.saveProjects(projects);
  }

  public delete(id: string): void {
    let projects = this.getProjects();
    projects = projects.filter((p) => p.id !== id);
    this.saveProjects(projects);
  }
}

