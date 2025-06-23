import { Request, Response } from 'express'
import { StoryModel } from '../models/story.model'

export const getStories = async (req: Request, res: Response) => {
  const projectId = req.params.projectId
  const stories = await StoryModel.find({ projectId })
  res.json(stories)
}

export const createStory = async (req: Request, res: Response) => {
  const newStory = new StoryModel(req.body)
  await newStory.save()
  res.status(201).json(newStory)
}

export const updateStory = async (req: Request, res: Response) => {
  const story = await StoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(story)
}

export const deleteStory = async (req: Request, res: Response) => {
  await StoryModel.findByIdAndDelete(req.params.id)
  res.status(204).send()
}
