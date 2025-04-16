import { signup, login } from '../app-auth/app-authentication';
import { User, IUser } from '../models/userModel';

export const authResolvers = {
  signup: async ({ name, email, password }: any) => signup({ name, email, password }),

  login: async ({ email, password }: any) => login({ email, password }),

  hello: () => 'Hello, world!',

  dashboard: (_: any, __: any, context: { user: { id: string } }) => {
    if (!context.user) throw new Error("Unauthorized");
    return `Hello user ${context.user.id}`;
  },

  linkDigilocker: async ({ userId }: { userId: string }) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.digilockerLinked = true;
    user.digilockerLinkedAt = new Date(); // 🕒 Save the timestamp
    await user.save();

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      digilockerLinked: user.digilockerLinked,
      digilockerLinkedAt: user.digilockerLinkedAt
        ? (user.digilockerLinkedAt as Date).toISOString()
        : null
    };
  },

  unlinkDigilocker: async ({ userId }: { userId: string }) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.digilockerLinked = false;
    user.digilockerLinkedAt = null; // 🧹 Clear timestamp
    await user.save();

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      digilockerLinked: user.digilockerLinked,
      digilockerLinkedAt: user.digilockerLinkedAt
        ? (user.digilockerLinkedAt as Date).toISOString()
        : null
    };
  },

  getUser: async ({ id }: any) => {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      digilockerLinked: user.digilockerLinked,
      digilockerLinkedAt: user.digilockerLinkedAt
        ? (user.digilockerLinkedAt as Date).toISOString()
        : null
    };
  },
};