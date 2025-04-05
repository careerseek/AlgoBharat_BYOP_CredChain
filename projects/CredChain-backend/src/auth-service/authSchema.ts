import { buildSchema } from 'graphql';


export const authSchema = buildSchema(`
  type User {
    id: ID!
    name: String!
    aadhaarNumber: String!
    token: String
  }

  type Query {
    login(aadhaarNumber: String!, otp: String!): User
    verifyToken(token: String!): User
  }

  type Mutation {
    requestOtp(aadhaarNumber: String!): String
  }
`);