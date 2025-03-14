import express from 'express';

import adminRoutes from '../routes/users/admin_routes.mjs';
import authRoutes from '../routes/users/auth_routes.mjs';
import teacherRoutes from '../routes/users/teacher_routes.mjs';
import studentsRoutes from '../routes/users/student_routes.mjs';
import advisorRoutes from '../routes/entities/advisor_routes.mjs';
import periodRoutes from '../routes/entities/period_routes.mjs';
import tesisRoutes from '../routes/entities/tesis_routes.mjs';
import assignamentRoutes from '../routes/entities/assignment_routes.mjs';
import statsRoutes from '../routes/entities/stats_routes.mjs';
import revisionRoutes from '../routes/entities/revision_routes.mjs';
import publicationRoutes from '../routes/entities/publication_routes.mjs';

const router = express.Router();

router.use('/api/itc/posgrado/coordinacion', adminRoutes);
router.use('/api/itc/posgrado/asesores', teacherRoutes);
router.use('/api/itc/posgrado/alumnos', studentsRoutes);
router.use('/api/itc/posgrado/usuario', authRoutes);
router.use('/api/itc/posgrado/asesoramiento', advisorRoutes);
router.use('/api/itc/posgrado/periodos', periodRoutes);
router.use('/api/itc/posgrado/tesis', tesisRoutes);
router.use('/api/itc/posgrado/asignaciones', assignamentRoutes);
router.use('/api/itc/posgrado/estadisticas', statsRoutes);
router.use('/api/itc/posgrado/revisiones', revisionRoutes);
router.use('/api/itc/posgrado/publicaciones', publicationRoutes);

export default router;