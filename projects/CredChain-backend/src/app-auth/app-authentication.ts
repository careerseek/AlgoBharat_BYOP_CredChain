/* stylelint-disable */
/* eslint-disable prettier/prettier */
import { generateToken } from '../utils/generateToken'
import { User, IUser } from '../models/userModel'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt';
import { signupSchema, loginSchema } from '../validation/userSchema';

export const signup = async ({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}) => {
  // ✅ Validate inputs
  signupSchema.parse({ name, email, password });
  
  const user = await User.findOne({ email });

  if (user) throw new Error("User already exists");
  

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = (await User.create({ name, email, password: hashedPassword })) as IUser;
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
  // ✅ Validate inputs
  loginSchema.parse({ email, password });

  const user = await User.findOne({ email });

  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = generateToken(user._id.toString());

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    token,
  };
};