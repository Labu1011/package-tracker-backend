import "dotenv/config"
import express, { Request, Response } from "express"
import { ApolloServer } from "apollo-server-express"
import { clerkMiddleware, getAuth, requireAuth } from "@clerk/express"
import { typeDefs } from "./graphql/typeDefs"
import { resolvers } from "./graphql/resolvers"

async function startServer() {
  const app = express()
  const port = process.env.PORT || 8000

  app.use(clerkMiddleware())

  const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    context: ({ req }) => {
      const auth = getAuth(req)
      const userId = auth.userId ?? null

      // Determine admin: prefer role from session claims, fallback to ENV list
      const claims: any = (auth as any)?.sessionClaims || {}
      const role = claims?.publicMetadata?.role || claims?.role
      const envAdmins = (process.env.ADMIN_USER_IDS || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)

      const isAdmin = role === "admin" || (userId && envAdmins.includes(userId))
      return { userId, isAdmin }
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
