import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { createHandler } from 'graphql-http/lib/use/express'
import { authSchema } from './auth-service/authSchema'
import { authResolvers } from './auth-service/authService'
import { connectDB } from './db/mongoose'

import selfRouter      from './routes/documents'
import digiRouter      from './routes/digilocker'
import thirdPartyRouter from './routes/thirdparty'
import verifyRouter    from './routes/verify'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

connectDB()

// REST endpoints
app.use('/documents/self',       selfRouter)
app.use('/documents/digilocker', digiRouter)
app.use('/documents/thirdparty', thirdPartyRouter)
app.use('/documents/verify',     verifyRouter)

// GraphQL
app.all(
  '/graphql',
  createHandler({
    schema: authSchema,
    rootValue: authResolvers,
    context: async (req) => {
      const headers = req.headers as any
      const token = headers.authorization?.split(' ')[1]
      let user = null
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string }
          user = { id: decoded.id }
        } catch (err) {
          console.warn('JWT verification failed:', err)
        }
      }
      return { user }
    },
  })
)

// Health‐check
app.get('/', (_req, res) => {
  res.send('Welcome to CredChain Backend API!')
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`🚀 CredChain Backend running at http://localhost:${PORT}`)
})

export default app
