import "dotenv/config"
import express, { Request, Response } from "express"
import { clerkMiddleware, requireAuth } from "@clerk/express"

const app = express()
const port = process.env.PORT || 3000

app.use(clerkMiddleware())

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" })
})
app.get("/msg", requireAuth(), (req: Request, res: Response) => {
  res.json({ message: "Hello msg!" })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
