import express from 'express'
import { getStories, createStory, updateStory, deleteStory } from '../controllers/story.controller'

const router = express.Router()

router.get('/:projectId', getStories)
router.post('/', createStory)
router.put('/:id', updateStory)
router.delete('/:id', deleteStory)

export default router
