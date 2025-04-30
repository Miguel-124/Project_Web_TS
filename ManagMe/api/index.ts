import type { Request, Response, NextFunction } from 'express'
import express from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import cors from 'cors'
import { users } from './users'
import type { User } from './users'

const app = express()
const port = 3000
const tokenSecret = process.env.TOKEN_SECRET as string
let storedRefreshToken = ''

app.use(cors())
app.use(express.json())

declare module 'express-serve-static-core' {
  interface Request {
    user?: User
  }
}

function generateToken(payload: object, expirationInSeconds: number) {
  const exp = Math.floor(Date.now() / 1000) + expirationInSeconds
  return jwt.sign({ ...payload, exp }, tokenSecret)
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

app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body

  const user = users.find((u) => u.username === username && u.password === password)

  if (!user) {
    return res.status(401).send('Invalid credentials')
  }

  const token = generateToken({ id: user.id, role: user.role }, 60)
  const refreshToken = generateToken({ id: user.id }, 60 * 60)
  storedRefreshToken = refreshToken

  return res.status(200).json({
    token,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  })
})

app.post('/refreshToken', (req: Request, res: Response) => {
  const { refreshToken } = req.body
  if (!refreshToken || refreshToken !== storedRefreshToken) {
    return res.status(400).send('Invalid refresh token')
  }

  const newToken = generateToken({ foo: 'bar' }, 60)
  const newRefreshToken = generateToken({ foo: 'bar' }, 60 * 60)
  storedRefreshToken = newRefreshToken

  return res.status(200).json({ token: newToken, refreshToken: newRefreshToken })
})


app.get('/me', verifyToken, (req: Request, res: Response) => {
  return res.status(200).json(req.user)
})

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
