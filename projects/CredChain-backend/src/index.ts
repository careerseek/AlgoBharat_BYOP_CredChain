import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createHandler } from 'graphql-http/lib/use/express';
import { authSchema } from './auth-service/authSchema';
import { buildSchema } from 'graphql';
import { authResolvers } from './auth-service/authService';
import { connectDB } from './db/mongoose'


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// GraphQL endpoint
app.all('/graphql', createHandler({ schema: authSchema, rootValue: authResolvers }));

const root = {
  hello: () => 'Hello, CredChain GraphQL API!'
};

app.get('/', (_req, res) => {
  res.send('Welcome to CredChain Backend API!');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 CredChain Backend running at http://localhost:${PORT}`);
});

export default app;
// This is the main entry point for the CredChain backend application.