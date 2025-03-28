export class Project {
  constructor(
    public id: string,
    public name: string,
    public description: string,
  ) {}
}

export type NewProject = Omit<Project, 'id'>
