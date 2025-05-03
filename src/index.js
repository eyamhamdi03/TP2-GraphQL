import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { createSchema } from 'graphql-yoga';
import { PubSub } from 'graphql-subscriptions';
import fs from 'node:fs';
import path from 'node:path';
import { Query } from './resolvers/Query.mjs';
import { Cv } from './resolvers/Cv.mjs';
import { User } from './resolvers/User.mjs';
import { Mutation } from './resolvers/Mutation.mjs';
import { Subscription } from './resolvers/Subscription.mjs';
import { db } from './db/db.mjs';
import { PrismaClient } from '@prisma/client';

const typeDefs = fs.readFileSync(
  path.resolve('src/schema/schema.graphql'),
  'utf-8'
);

const pubsub = new PubSub();
const prisma=new PrismaClient()
const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers: {
      Query,
      Mutation,
      Cv,
      User,
      Subscription,
    },
  }),
  context: () => ({ db, pubsub,prisma }),
  graphqlEndpoint: '/graphql',
  cors: true,
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.log('Server ready at http://localhost:4000/graphql');
});
