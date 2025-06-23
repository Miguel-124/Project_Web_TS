import { Request, Response } from 'express'
import * as projectService from '../services/project.services'

export const getProjects = async (_req: Request, res: Response) => {
  const projects = await projectService.getAllProjects()
  res.json(projects)
}

export const getProjectById = async (req: Request, res: Response) => {
  const project = await projectService.getProject(req.params.id)
  if (!project) return res.status(404).json({ message: 'Projekt nie znaleziony' })
  res.json(project)
}

export const createProject = async (req: Request, res: Response) => {
  const { name, description } = req.body
  const newProject = await projectService.createProject({ name, description })
  res.status(201).json(newProject)
}

export const updateProject = async (req: Request, res: Response) => {
  const updated = await projectService.updateProject(req.params.id, req.body)
  if (!updated) return res.status(404).json({ message: 'Projekt nie znaleziony' })
  res.json(updated)
}

export const deleteProject = async (req: Request, res: Response) => {
  const deleted = await projectService.deleteProject(req.params.id)
  if (!deleted) return res.status(404).json({ message: 'Projekt nie znaleziony' })
  res.json({ message: 'Usunięto projekt' })
}
