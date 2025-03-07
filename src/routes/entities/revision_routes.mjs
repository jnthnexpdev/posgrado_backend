import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import * as revisionControllers from '../../controllers/entities/revision_controllers.mjs';

const secret = process.env.SECRET;
const router = express.Router();

router.use(cookieParser(secret));
router.post('/registrar-entrega-alumno', revisionControllers.createRevision);
router.get('/informacion-entrega-alumno/:idAssignment', revisionControllers.getRevision);
router.get('/obtener-entregas-asignacion/:idAssignment', revisionControllers.getAllRevisionOfAssignment);

export default router;