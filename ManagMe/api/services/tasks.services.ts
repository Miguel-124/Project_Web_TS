import { TaskModel } from '../models/tasks.model'

export const getTasksByStory = async (storyId: string) => {
  return await TaskModel.find({ storyId })
}

export const createTask = async (data: any) => {
  const newTask = new TaskModel(data)
  return await newTask.save()
}

export const updateTask = async (id: string, data: any) => {
  return await TaskModel.findByIdAndUpdate(id, data, { new: true })
}

export const deleteTask = async (id: string) => {
  return await TaskModel.findByIdAndDelete(id)
}
