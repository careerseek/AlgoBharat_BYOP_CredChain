/* stylelint-disable */
/* eslint-disable prettier/prettier */
import { generateToken } from '../utils/generateToken'
import { User, IUser } from '../models/userModel'
import mongoose from 'mongoose'


export const signup = async ({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}) => {
  const existing = await User.findOne({ email })
  if (existing) throw new Error('User already exists')

  const newUser = (await User.create({ name, email, password })) as IUser;
  const token = generateToken(newUser._id.toString())

  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    // walletAddress: newUser.walletAddress,
    token,
  }
}

export const login = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  const user = await User.findOne({ email, password }) // Plaintext for now, bcrypt later
  if (!user) throw new Error('Invalid credentials')

  const token = generateToken(user._id.toString())

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    // walletAddress: user.walletAddress,
    token,
  }
}