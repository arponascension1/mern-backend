import express from 'express';
import {create, login, logout, me, updateUser} from "../controller/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/', login)
router.post('/register', create)
router.get('/me', authMiddleware, me)
router.put('/update', authMiddleware, updateUser)
router.post('/logout', authMiddleware, logout)


export default router;