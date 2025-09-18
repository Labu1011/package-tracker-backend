import "dotenv/config"
import express, { Request, Response } from "express"
import { ApolloServer } from "apollo-server-express"
import { clerkMiddleware, requireAuth } from "@clerk/express"
import { typeDefs } from "./graphql/typeDefs"
import { resolvers } from "./graphql/resolvers"

async function startServer() {
  const app = express()
  const port = process.env.PORT || 3000

  const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    context: ({ req }) => {
      return {}
    },
  })
  await server.start()
  server.applyMiddleware({ app, path: "/graphql" })

  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World!" })
  })

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

startServer()
