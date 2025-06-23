// api/main.ts
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import projectRoutes from './routes/project.routes'

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/managme')
  .then(() => console.log('✅ Połączono z MongoDB'))
  .catch(err => console.error('❌ Błąd MongoDB:', err))

app.use('/api/projects', projectRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`🚀 Serwer działa na porcie ${PORT}`))
