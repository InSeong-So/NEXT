import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import resolvers from './resolvers/index';
import schema from './schema/index';
import { readDB } from './dbController';
import { DBField } from './types';

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    db: {
      messages: readDB(DBField.MESSAGES),
      users: readDB(DBField.USERS),
    },
  },
});

const app = express();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.listen({ port: 8000 }, async () => {
  await server.start();
  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: {
      origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
      credentials: true,
    },
  });
});
console.log('server listening on 8000...');
