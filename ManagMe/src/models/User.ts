export class User {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }
}
