import { buildSchema } from 'graphql';

export const authSchema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    token: String!
  }

  type Query {
    hello: String
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
  }
`);