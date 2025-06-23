import { Request, Response } from 'express'
import * as storyService from '../services/story.services'

export const getStories = async (req: Request, res: Response) => {
  const projectId = req.params.projectId
  const stories = await storyService.getStoriesByProject(projectId)
  res.json(stories)
}

export const createStory = async (req: Request, res: Response) => {
  const newStory = await storyService.createStory(req.body)
  res.status(201).json(newStory)
}

export const updateStory = async (req: Request, res: Response) => {
  const story = await storyService.updateStory(req.params.id, req.body)
  res.json(story)
}

export const deleteStory = async (req: Request, res: Response) => {
  await storyService.deleteStory(req.params.id)
  res.status(204).send()
}
