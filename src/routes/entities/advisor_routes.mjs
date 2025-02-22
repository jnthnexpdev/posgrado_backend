import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import * as adviceControllers from '../../controllers/entities/advice_controllers.mjs';

const secret = process.env.SECRET;
const router = express.Router();

router.use(cookieParser(secret));
router.post('/registrar-asesorado', adviceControllers.registerAdviced);
router.get('/detalles-asesoramiento/:id', adviceControllers.detailsAdvice);
router.get('/alumnos-asesorados/:period', adviceControllers.searchAdvisedsByTeacher);
router.get('/informacion-asesor', adviceControllers.advisorInfo);
router.get('/exportar-alumnos-asesorados/:period', adviceControllers.exportAdvicedByPeriodPDF);
router.get('/conteo-alumnos-asesorados', adviceControllers.counterAdvised);
// router.post('/solicitar-asesor', adminControllers.registerAdminAccount);
// router.get('/informacion-asesoramiento', assignamentControllers.allAdminsAccounts);
router.delete('/eliminar-asesoramiento/:id', adviceControllers.deleteAdviced);

export default router;