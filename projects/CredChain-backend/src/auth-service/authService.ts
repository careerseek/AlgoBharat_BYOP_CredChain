import { signup, login } from '../app-auth/app-authentication';

export const authResolvers = {
  signup: async ({ name, email, password }: any) => signup({ name, email, password }),
  login: async ({ email, password }: any) => login({ email, password }),
  hello: () => 'Hello, world!',
  dashboard: (_: any, __: any, context: { user: { id: string } }) => {
    if (!context.user) throw new Error("Unauthorized");
    return `Hello user ${context.user.id}`;
  }
};