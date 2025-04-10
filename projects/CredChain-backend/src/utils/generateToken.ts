/* eslint-disable prettier/prettier */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // ✅ Make sure this is at the top

const secret = process.env.JWT_SECRET || 'default-fallback-secret';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, secret, { expiresIn: '30d' }); // ✅ add expiry here
};

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, secret) as { userId: string };
  } catch (err) {
    return null;
  }
};