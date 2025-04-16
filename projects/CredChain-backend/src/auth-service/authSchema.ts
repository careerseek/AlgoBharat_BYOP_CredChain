import { buildSchema } from 'graphql';

export const authSchema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    token: String!
    digilockerLinked: Boolean!
    digilockerLinkedAt: String!
  }

  type Query {
    hello: String
    getUser(id: ID!): User
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
    linkDigilocker(userId: ID!): User
    unlinkDigilocker(userId: ID!): User
  }
`);