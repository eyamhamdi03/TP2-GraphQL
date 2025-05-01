import { createServer } from 'node:http'
import {Query} from './resolvers/Query.mjs'
import { createSchema, createYoga } from 'graphql-yoga'
import fs from 'node:fs'
import path from 'node:path'
import { Cv } from './resolvers/Cv.mjs'
import { User } from './resolvers/User.mjs'

const typeDefs = fs.readFileSync(path.resolve('src/schema/schema.graphql'), 'utf-8')

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers: {
      Query,
      Cv,
      User
    }
  })
})

const server = createServer(yoga)

server.listen(4000, () => {
  console.log('Server is running on http://localhost:4000/graphql')
})
