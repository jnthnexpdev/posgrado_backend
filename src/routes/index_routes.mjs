import adminRoutes from '../routes/users/admin_routes.mjs';
import express from 'express';

const router = express.Router();

router.use('/api/itc/posgrado/coordinacion', adminRoutes);

export default router;