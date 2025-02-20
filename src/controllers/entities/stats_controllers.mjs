import mongoose from 'mongoose';

import AppError from '../../utils/errors/server_errors.mjs';
import * as statsService from '../../services/entities/stats_service.mjs';
import { handleServerError } from '../../utils/errors/error_handle.mjs';

// Generar estadisticas del sistema
export const getStatsSystem = async(req, res) => {
    try {
        const stats = await statsService.statsSystem();

        return res.status(200).json({
            success : true,
            httpCode : 200,
            message : 'Estadisticas generadas',
            stats
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.httpCode).json({
                success: false,
                httpCode: error.httpCode,
                message: error.message,
            });
        }
        handleServerError(res, error);
    }
}