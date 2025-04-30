//api/users.ts
export type User = {
  id: string
  username: string
  password: string
  firstName: string
  lastName: string
  role: 'admin' | 'devops' | 'developer'
}

export const users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  },
  {
    id: '2',
    username: 'dev1',
    password: 'dev123',
    firstName: 'Dev',
    lastName: 'User',
    role: 'developer',
  },
  {
    id: '3',
    username: 'devops1',
    password: 'devops123',
    firstName: 'DevOps',
    lastName: 'User',
    role: 'devops',
  },
]
