import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import * as authControllers from '../../controllers/users/auth_controllers.mjs';

const secret = process.env.SECRET;
const router = express.Router();

router.use(cookieParser(secret));
router.post('/iniciar-sesion', authControllers.login);
router.patch('/cambiar-password', authControllers.changePassword);
router.patch('/cambiar-correo', authControllers.changeEmail);

export default router;