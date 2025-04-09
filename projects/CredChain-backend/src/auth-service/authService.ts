import { signup, login } from '../app-auth/app-authentication';

export const authResolvers = {
  signup: async ({ name, email, password }: any) => signup({ name, email, password }),
  login: async ({ email, password }: any) => login({ email, password }),
  hello: () => 'Hello, world!'
};