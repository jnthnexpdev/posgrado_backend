import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import * as periodControllers from '../../controllers/entities/period_controllers.mjs';

const secret = process.env.SECRET;
const router = express.Router();

router.use(cookieParser(secret));
router.post('/registrar-periodo', periodControllers.registerPeriod);
router.get('/listado-periodos', periodControllers.allPeriods);
router.patch('/agregar-alumno/:idStudent/:idPeriod', periodControllers.addStudentToPeriod);
router.delete('/eliminar-periodo/:id', periodControllers.deletePeriod);

export default router;