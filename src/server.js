require('dotenv').config();

const { ApolloServer } = require('apollo-server')
const { schema } = require('./schema')
const { createContext } = require('./context')

new ApolloServer({ schema, context: createContext }).listen(
  { port: process.env.APOLLO_SERVER_PORT },
  () =>
    console.log(
      `🚀 Server ready at: http://localhost:${process.env.APOLLO_SERVER_PORT}`,
    ),
)
