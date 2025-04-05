/* stylelint-disable */
/* eslint-disable prettier/prettier */
import { generateToken } from '../utils/generateToken'

interface User {
  id: string
  name: string
  email: string
  password: string
}

const users: User[] = []

export const signup = ({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}) => {
  const existing = users.find((u) => u.email === email)
  if (existing) throw new Error('User already exists')

  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    password,
  }

  users.push(newUser)
  const token = generateToken(newUser.id)
  return { ...newUser, token }
}

export const login = ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  const user = users.find((u) => u.email === email && u.password === password)
  if (!user) throw new Error('Invalid credentials')

  const token = generateToken(user.id)
  return { ...user, token }
}