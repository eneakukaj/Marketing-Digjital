import express from 'express';
const router = express.Router();
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;