//api/auth.ts
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { users } from './users'
import { OAuth2Client } from 'google-auth-library'

const JWT_SECRET = 'tajnysekret'
const REFRESH_SECRET = 'tajnyodswiezacz'
const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  '485046110075-evqncdgr6ae1qp98comc58thl6djjh7b.apps.googleusercontent.com'

export async function googleLogin(req: Request, res: Response) {
  const { token } = req.body

  const client = new OAuth2Client(GOOGLE_CLIENT_ID)

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()

    if (!payload || !payload.email || !payload.sub) {
      return res.status(401).json({ message: 'Invalid Google token payload' })
    }

    const user = {
      id: payload.sub,
      username: payload.email,
      firstName: payload.given_name || '',
      lastName: payload.family_name || '',
      role: 'guest' as const,
    }

    const jwtToken = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' })
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' })

    res.json({ token: jwtToken, refreshToken, user })
  } catch (error) {
    console.error(error)
    res.status(401).json({ message: 'Token verification failed' })
  }
}

export function login(req: Request, res: Response) {
  const { username, password } = req.body
  const user = users.find((u) => u.username === username && u.password === password)

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userData } = user
  const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '1h' })
  const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' })

  res.json({ token, refreshToken, user: userData })
}

export function refreshToken(req: Request, res: Response) {
  const { refreshToken } = req.body

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { id: string }
    const user = users.find((u) => u.id === decoded.id)
    if (!user) return res.status(401).json({ message: 'Invalid refresh token' })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userData } = user
    const newToken = jwt.sign(userData, JWT_SECRET, { expiresIn: '1h' })
    const newRefreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' })

    res.json({ token: newToken, refreshToken: newRefreshToken })
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' })
  }
}
