// Simple in-memory user store for development
interface User {
  id: string
  username: string
  email: string
  password: string
  createdAt: Date
}

let users: User[] = []

export const userStore = {
  create: (userData: Omit<User, 'id' | 'createdAt'>) => {
    const user: User = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date()
    }
    users.push(user)
    return user
  },

  findByEmail: (email: string) => {
    return users.find(user => user.email === email)
  },

  findByUsername: (username: string) => {
    return users.find(user => user.username === username)
  },

  findById: (id: string) => {
    return users.find(user => user.id === id)
  }
}