import express from 'express';
import * as teacherControllers from '../../controllers/users/teacher_controllers.mjs';

const router = express.Router();

router.post('/registrar-cuenta', teacherControllers.registerTeacherAccount);
router.get('/listado-cuentas', teacherControllers.allTeachersAccounts);
router.delete('/eliminar-cuenta/:id', teacherControllers.deleteTeacherAccount);

export default router;