import mongoose from 'mongoose';

import AppError from '../../utils/errors/server_errors.mjs';
import * as periodService from '../../services/entities/period_service.mjs';
import { handleServerError } from '../../utils/errors/error_handle.mjs';

export const registerPeriod = async(req, res) => {
    try{
        const periodData = req.body.periodo;
        
        const period = await periodService.registerNewPeriod(periodData);

        return res.status(201).json({
            success : true,
            httpCode : 201,
            message : 'Periodo registrado',
            period : period
        });
    }catch(error){
        if (error instanceof AppError){
            return res.status(error.httpCode).json({
                success: false,
                httpCode: error.httpCode,
                message: error.message,
            });
        }
        handleServerError(res, error);
    }
}

export const allPeriods = async(req, res) => {
    try {
       const periods = await periodService.allPeriods(req.query); 

       return res.status(200).json({
            success: true,
            message: 'Periodos obtenidos correctamente',
            periods: periods.periods,
            pagination: periods.pagination
        });
    } catch (error) {
        if (error instanceof AppError){
            return res.status(error.httpCode).json({
                success: false,
                httpCode: error.httpCode,
                message: error.message,
            });
        }
        handleServerError(res, error);
    }
}