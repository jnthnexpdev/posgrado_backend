import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import * as tesisControllers from '../../controllers/entities/tesis_controllers.mjs';

const secret = process.env.SECRET;
const router = express.Router();

router.use(cookieParser(secret));
router.post('/registrar-tesis', tesisControllers.registerTesis);
router.get('/buscar-tesis-alumno', tesisControllers.getTesisByStudent);
router.get('/tesis-alumnos-periodo/:period', tesisControllers.getAllTesisOfPeriod);
router.put('/editar-informacion/:id', tesisControllers.updateTesisInfo);

export default router;