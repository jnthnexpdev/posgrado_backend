import express from 'express';
import multer from 'multer';
import * as studentControllers from '../../controllers/users/student_controllers.mjs';

const upload = multer();
const router = express.Router();

router.post('/registrar-cuenta', studentControllers.registerStudentAccount);
router.post('/registrar-alumnos-csv/:idPeriod', upload.single('file'), studentControllers.registerStudentsFromCSV);
router.get('/listado-alumnos', studentControllers.allStudentsAccounts);
router.get('/exportar-alumnos', studentControllers.exportStudentsByPeriodPDF);
router.delete('/eliminar-cuenta/:id', studentControllers.deleteStudentAccount);

export default router;