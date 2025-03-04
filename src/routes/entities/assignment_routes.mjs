import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import * as assignmentControllers from '../../controllers/entities/assignment_controllers.mjs';

const secret = process.env.SECRET;
const router = express.Router();

router.use(cookieParser(secret));
router.post('/crear-asignacion', assignmentControllers.registerAssignment);
router.get('/obtener-asignaciones-asesor-periodo/:period', assignmentControllers.assignmentsOfAdvisorByPeriod);
router.get('/obtener-asignaciones-alumno-periodo/:period', assignmentControllers.assignmentsOfStudent);
router.get('/buscar-asignacion/:id', assignmentControllers.getAssignmentById);
router.patch('/editar-asignacion/:id', assignmentControllers.updateAssignment);
router.delete('/eliminar-asignacion/:id', assignmentControllers.deleteAssingment);

export default router;