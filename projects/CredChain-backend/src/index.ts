import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createHandler } from 'graphql-http/lib/use/express';
import { buildSchema } from 'graphql';

dotenv.config();

const app = express();
app.use(cors());

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello: () => 'Hello, CredChain GraphQL API!'
};

app.all('/graphql', createHandler({ schema, rootValue: root }));

app.get('/', (_req, res) => {
  res.send('Welcome to CredChain Backend API!');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 CredChain Backend running at http://localhost:${PORT}`);
});