import express from 'express';
import * as adminControllers from '../../controllers/users/admin_controllers.mjs';

const router = express.Router();

router.post('/registrar-cuenta', adminControllers.registerAdminAccount);

export default router;