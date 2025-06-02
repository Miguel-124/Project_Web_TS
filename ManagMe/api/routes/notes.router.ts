import express from 'express'
import { notesController } from '../controllers/notes.controller'

const router = express.Router()

router.get('', notesController.getNotes)

router.get('/:id', (req, res, next) => {
  const id = req.params.id
  console.log('[note] validate token', id)
  next()
})

router.get('/:id', notesController.getNote)
router.post('', notesController.createNote)
router.put('/:id', notesController.updateNote)
router.patch('/:id', notesController.patchNote)
router.delete('/:id', notesController.removeNote)

export default router
