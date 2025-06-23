import mongoose from 'mongoose'

const storySchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  createdAt: { type: String, required: true }
})

export const StoryModel = mongoose.model('Story', storySchema)
