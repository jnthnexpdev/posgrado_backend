import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import * as statsControllers from '../../controllers/entities/stats_controllers.mjs';

const secret = process.env.SECRET;
const router = express.Router();

router.use(cookieParser(secret));
router.get('/estadisticas-generales', statsControllers.getStatsSystem);

export default router;