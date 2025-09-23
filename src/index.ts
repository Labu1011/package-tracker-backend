import "dotenv/config"
import express, { Request, Response } from "express"
import cors from "cors"
import { ApolloServer } from "apollo-server-express"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { clerkMiddleware, getAuth } from "@clerk/express"
import { typeDefs } from "./graphql/typeDefs"
import { resolvers } from "./graphql/resolvers"
import { createServer } from "http"
import { WebSocketServer } from "ws"
import { useServer } from "graphql-ws/use/ws"

async function startServer() {
  const app = express()
  const port = process.env.PORT || 8000

  const corsOptions: cors.CorsOptions = {
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }

  app.use(cors(corsOptions))
  app.options("/graphql", cors(corsOptions))
  app.use(clerkMiddleware())

  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const server = new ApolloServer({
    schema,
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

  // Create HTTP server and WebSocket server
  const httpServer = createServer(app)
  server.applyMiddleware({ app, path: "/graphql", cors: false })

  // Set up graphql-ws WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  })

  useServer(
    {
      schema,
      context: async (ctx, msg, args) => {
        // Optionally add auth context for subscriptions here
        return {}
      },
    },
    wsServer
  )

  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World!" })
  })

  httpServer.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`)
    console.log(`🚀 Subscriptions ready at ws://localhost:${port}/graphql`)
  })
}

startServer()
