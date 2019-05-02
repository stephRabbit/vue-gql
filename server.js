const { ApolloServer, AuthenticationError } = require('apollo-server')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')

// Import typeDefs and resolver
const filePath = path.join(__dirname, 'typeDefs.gql')
const typeDefs = fs.readFileSync(filePath, 'utf-8')
const resolvers = require('./resolvers')

// Import environment variables and Mongoose Models
require('dotenv').config({ path: 'variables.env' })
const User = require('./models/User')
const Post = require('./models/Post')

// Connect to Atlas: MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(() => console.log('DB connected'))
  .catch(err => console.error(err))

// Verify JWT passed from client
const getUser = async token => {
  if (token) {
    try {
      return await jwt.verify(token, process.env.APP_SECERT)
      console.log(user)
    } catch (err) {
      throw new AuthenticationError(
        'Your session has expiried. Please sign in again.'
      )
    }
  }
}

// Create Apollo/GQL server using typeDefs, resolvers and context object
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => ({
    name: error.name,
    message: error.message.replace('Context creation failed:', '')
  }),
  context: async ({ req }) => {
    const token = req.headers['authorization']
    return {
      User,
      Post,
      currentUser: await getUser(token)
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`)
})
