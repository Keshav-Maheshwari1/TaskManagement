import express from 'express';
import { getAllUsers, findUserByEmail, updateUser, deleteUser } from "../controllers/userController.js";
const router = express.Router();


router.get('/', getAllUsers);
router.get('/:email', findUserByEmail);
router.put('/:email', updateUser);
router.delete('/:email', deleteUser);

export default router;