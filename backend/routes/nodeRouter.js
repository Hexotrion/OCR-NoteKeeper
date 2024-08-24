import express from 'express';
import auth from '../middleware/auth.js';
import noteCtrl from '../controllers/noteCtrl.js';

const router = express.Router();

router.route('/')
    .get(auth, noteCtrl.getNotes)
    .post(auth, noteCtrl.createNote);

router.route('/:id')
    .get(auth, noteCtrl.getNote)
    .put(auth, noteCtrl.updateNote)
    .delete(auth, noteCtrl.deleteNote);

export default router;
