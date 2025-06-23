import { Project } from '../models/project.model'

export const getAllProjects = async () => {
  return await Project.find().sort({ createdAt: -1 })
}

export const getProject = async (id: string) => {
  return await Project.findById(id)
}

export const createProject = async (data: { name: string; description?: string }) => {
  const newProject = new Project(data)
  return await newProject.save()
}

export const updateProject = async (id: string, data: Partial<{ name: string; description: string }>) => {
  return await Project.findByIdAndUpdate(id, data, { new: true })
}

export const deleteProject = async (id: string) => {
  return await Project.findByIdAndDelete(id)
}
