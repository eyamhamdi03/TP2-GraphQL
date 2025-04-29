import { createServer } from 'node:http'
import { createSchema, createYoga } from 'graphql-yoga'

const yoga = createYoga({
  schema: createSchema({
    //schema de graphql
    // ce que nous offrons a travers le serveur graphql
    typeDefs: /* GraphQL */ `
        type Query {
        hello: String
      }
    `,
    //implementation du contrat
    resolvers: {
      Query: {
        hello: () => 'Hello from Yoga!'
      }
    }
  })
})

const server = createServer(yoga)

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})