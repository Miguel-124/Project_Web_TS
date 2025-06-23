// api/controllers/project.controller.ts
import { Request, Response } from 'express';
import { Project } from '../models/project.model';

export const getProjects = async (_req: Request, res: Response) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
};

export const getProjectById = async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Projekt nie znaleziony' });
  res.json(project);
};

export const createProject = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const newProject = new Project({ name, description });
  await newProject.save();
  res.status(201).json(newProject);
};

export const updateProject = async (req: Request, res: Response) => {
  const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Projekt nie znaleziony' });
  res.json(updated);
};

export const deleteProject = async (req: Request, res: Response) => {
  const deleted = await Project.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Projekt nie znaleziony' });
  res.json({ message: 'Usunięto projekt' });
};
