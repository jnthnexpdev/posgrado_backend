import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import * as assignamentControllers from '../../controllers/entities/advisor_assingnment_controllers.mjs';

const secret = process.env.SECRET;
const router = express.Router();

router.use(cookieParser(secret));
router.post('/registrar-asesorado', assignamentControllers.registerAdviced);
router.get('/detalles-asesoramiento/:id', assignamentControllers.detailsAdvice);
router.get('/alumnos-asesorados', assignamentControllers.searchAdvisedsByTeacher);
// router.post('/solicitar-asesor', adminControllers.registerAdminAccount);
// router.get('/informacion-asesoramiento', assignamentControllers.allAdminsAccounts);
router.delete('/eliminar-asesoramiento/:id', assignamentControllers.deleteAdviced);

export default router;