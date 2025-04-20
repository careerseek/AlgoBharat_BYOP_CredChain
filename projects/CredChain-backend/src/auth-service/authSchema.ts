import { buildSchema } from 'graphql';

export const authSchema = buildSchema(`
  scalar JSON

  type User {
    id: ID!
    name: String!
    email: String!
    token: String!
    digilockerLinked: Boolean!
    digilockerLinkedAt: String!
    lastDigilockerSyncedAt: String
  }
  

  type UserDocument {
    id: ID!
    userId: ID!
    docId: String!
    description: String
    docType: String!
    issueDate: String!
    issuerId: String!
    orgId: String!
    orgName: String!
    parameters: JSON
    udf1: String
    hash: String
    ipfsUrl: String
    verified: Boolean!
  }

  type Query {
    hello: String
    getUser(id: ID!): User
    getUserDocuments(userId: ID!): [UserDocument] 
  }
  
  type SyncDocumentsResult {
    documents: [UserDocument]
    lastSyncedAt: String
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
    linkDigilocker(userId: ID!): User
    syncMockDocuments(userId: ID!): SyncDocumentsResult
  }
`);