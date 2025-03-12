import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import * as publicationControllers from '../../controllers/entities/publication_controllers.mjs';

const secret = process.env.SECRET;
const router = express.Router();

router.use(cookieParser(secret));
router.post('/registrar-publicacion', publicationControllers.registerPublication);
router.get('/buscar-publicacion-alumno', publicationControllers.getPublicationOfStudent);
router.put('/editar-informacion/:id', publicationControllers.updatePublicationInfo);

export default router;