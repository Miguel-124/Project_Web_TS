// model/User.ts
export type UserRole = 'admin' | 'devops' | 'developer'

export class User {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public role: UserRole,
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }
}
