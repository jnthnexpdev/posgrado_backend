import express from 'express';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

import * as periodControllers from '../../controllers/entities/period_controllers.mjs';

const upload = multer();
const secret = process.env.SECRET;
const router = express.Router();

router.use(cookieParser(secret));
router.post('/registrar-periodo', periodControllers.registerPeriod);
router.post('/agregar-alumnos-csv/:idPeriod', upload.single('file'), periodControllers.addStudentsToPeriodFromCSV);
router.get('/listado-periodos', periodControllers.allPeriods);
router.get('/listado-alumnos-periodo/:id', periodControllers.studentsByPeriod);
router.get('/exportar-periodos', periodControllers.exportPeriodsPDF);
router.patch('/agregar-alumno/:idStudent/:idPeriod', periodControllers.addStudentToPeriod);
router.delete('/eliminar-periodo/:id', periodControllers.deletePeriod);

export default router;