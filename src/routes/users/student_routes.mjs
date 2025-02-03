import express from 'express';
import * as studentControllers from '../../controllers/users/student_controllers.mjs';

const router = express.Router();

router.post('/registrar-cuenta', studentControllers.registerStudentAccount);
router.get('/listado-alumnos', studentControllers.allStudentsAccounts);
router.get('/exportar-alumnos', studentControllers.exportStudentsByPeriodPDF);
router.delete('/eliminar-cuenta/:id', studentControllers.deleteStudentAccount);

export default router;