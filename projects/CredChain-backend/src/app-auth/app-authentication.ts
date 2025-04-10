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
  const user = await User.findOne({ email });

  if (user) throw new Error("User already exists");
  

  const newUser = (await User.create({ name, email, password })) as IUser;
  console.log('New user created:', newUser);
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
  const user = await User.findOne({ email });

  if (!user) throw new Error('Invalid credentials');

  if (user.password !== password) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user._id.toString());

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    token,
  };
};