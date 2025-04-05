/* eslint-disable prettier/prettier */
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'credchain-default-secret';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, secret) as { userId: string };
  } catch (err) {
    return null;
  }
};