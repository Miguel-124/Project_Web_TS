import { StoryModel } from '../models/story.model'

export const getStoriesByProject = async (projectId: string) => {
  return await StoryModel.find({ projectId })
}

export const createStory = async (data: any) => {
  const newStory = new StoryModel(data)
  return await newStory.save()
}

export const updateStory = async (id: string, data: any) => {
  return await StoryModel.findByIdAndUpdate(id, data, { new: true })
}

export const deleteStory = async (id: string) => {
  return await StoryModel.findByIdAndDelete(id)
}
