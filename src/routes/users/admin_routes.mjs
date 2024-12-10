import express from 'express';
import * as adminControllers from '../../controllers/users/admin_controllers.mjs';

const router = express.Router();

router.post('/registrar-cuenta', adminControllers.registerAdminAccount);
router.get('/listado-cuentas', adminControllers.allAdminsAccounts);
router.delete('/eliminar-cuenta/:id', adminControllers.deleteAdminAccount);

export default router;