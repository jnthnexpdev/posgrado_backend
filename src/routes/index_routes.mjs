import express from 'express';

import adminRoutes from '../routes/users/admin_routes.mjs';
import teacherRoutes from '../routes/users/teacher_routes.mjs';

const router = express.Router();

router.use('/api/itc/posgrado/coordinacion', adminRoutes);
router.use('/api/itc/posgrado/asesores', teacherRoutes);

export default router;