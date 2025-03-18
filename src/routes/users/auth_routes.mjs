import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import * as authControllers from '../../controllers/users/auth_controllers.mjs';

const secret = process.env.SECRET;
const router = express.Router();

router.use(cookieParser(secret));
router.post('/iniciar-sesion', authControllers.login);
router.post('/cerrar-sesion', authControllers.logout);
router.post('/validar-codigo-acceso', authControllers.validateAccessCode);
router.get('/informacion-usuario', authControllers.dataUser);
router.get('/validar-correo/:email', authControllers.validateEmail);
router.get('/solicitar-codigo-acceso/:email', authControllers.generateAccessCode);
router.get('/tipo-usuario', authControllers.userTypeAccount);
router.get('/usuario-autenticado', authControllers.userAuth);
router.patch('/cambiar-password', authControllers.changePassword);
router.patch('/cambiar-correo', authControllers.changeEmail);
router.patch('/actualizar-usuarios', authControllers.updateUsers);
router.delete('/eliminar-mi-cuenta', authControllers.deleteMyAccount);

export default router;