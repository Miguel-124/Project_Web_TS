import { Request, Response } from 'express'
import * as taskService from '../services/tasks.services'

export const getAllTasks = async (req: Request, res: Response) => {
  const { storyId } = req.query
  if (!storyId || typeof storyId !== 'string') {
    return res.status(400).json({ error: 'Brak lub błędne storyId' })
  }

  const tasks = await taskService.getTasksByStory(storyId)
  res.json(tasks)
}

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await taskService.createTask(req.body)
    res.status(201).json(task)
  } catch (err) {
    res.status(400).json({ error: 'Nie udało się utworzyć zadania', details: err })
  }
}

export const updateTask = async (req: Request, res: Response) => {
  try {
    const updated = await taskService.updateTask(req.params.id, req.body)
    res.json(updated)
  } catch (err) {
    res.status(400).json({ error: 'Nie udało się zaktualizować zadania', details: err })
  }
}

export const deleteTask = async (req: Request, res: Response) => {
  try {
    await taskService.deleteTask(req.params.id)
    res.status(204).end()
  } catch (err) {
    res.status(400).json({ error: 'Nie udało się usunąć zadania', details: err })
  }
}
