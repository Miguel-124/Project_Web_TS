// models/task.model.ts
import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  storyId: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['todo', 'in progress', 'done'], default: 'todo' },
  estimatedTime: Number,
  createdAt: { type: String, required: true },
  startedAt: String,
  finishedAt: String,
  assignedUserId: String
})

export const TaskModel = mongoose.model('Task', taskSchema)
