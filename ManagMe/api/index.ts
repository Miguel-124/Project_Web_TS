//api/index.ts
import type { Request, Response, NextFunction } from 'express'
import express from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import cors from 'cors'
import { users } from './users'
import type { User } from './users'
import { login, refreshToken, googleLogin } from './auth'
import mongoose from 'mongoose'
import noteRoutes from './routes/notes.router'

mongoose.connect(process.env.MONGO_URI!, {
  dbName: 'managme-db', // lub inna nazwa bazy
})
.then(() => console.log('✅ Połączono z MongoDB'))
.catch(err => console.error('❌ Błąd połączenia z MongoDB:', err));

const app = express()
const port = 3000
const tokenSecret = process.env.TOKEN_SECRET as string

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use('/api/notes', noteRoutes)


declare module 'express-serve-static-core' {
  interface Request {
    user?: User
  }
}

function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]

  if (!token) {
    res.status(403).send('Brak tokenu')
    return
  }

  jwt.verify(token, tokenSecret, (err, decoded) => {
    if (err) {
      res.status(401).send('Token nieprawidłowy')
      return
    }

    req.user = decoded as User
    next()
  })
}

app.post('/google-login', googleLogin)

app.post('/login', login)

app.post('/refreshToken', refreshToken)

app.get('/users', (req: Request, res: Response) => {
  const usersWithoutPasswords = users.map((user) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user
    return rest
  })
  res.status(200).json(usersWithoutPasswords)
})

app.get('/me', verifyToken, (req: Request, res: Response) => {
  return res.status(200).json(req.user)
})

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
