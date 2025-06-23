// api/controllers/task.controller.ts
import { Request, Response } from 'express'
import { TaskModel } from '../models/tasks.model'

export const getAllTasks = async (req: Request, res: Response) => {
  const { storyId } = req.query
  if (!storyId || typeof storyId !== 'string') {
    return res.status(400).json({ error: 'Brak lub błędne storyId' })
  }

  const tasks = await TaskModel.find({ storyId })
  res.json(tasks)
}

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = new TaskModel(req.body)
    await task.save()
    res.status(201).json(task)
  } catch (err) {
    res.status(400).json({ error: 'Nie udało się utworzyć zadania', details: err })
  }
}

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const updated = await TaskModel.findByIdAndUpdate(id, req.body, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(400).json({ error: 'Nie udało się zaktualizować zadania', details: err })
  }
}

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await TaskModel.findByIdAndDelete(id)
    res.status(204).end()
  } catch (err) {
    res.status(400).json({ error: 'Nie udało się usunąć zadania', details: err })
  }
}
