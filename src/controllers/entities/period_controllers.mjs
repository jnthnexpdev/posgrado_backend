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

export const addStudentToPeriod = async(req, res) => {
    try {
        const isIdPeriodValid = mongoose.isValidObjectId(req.params.idPeriod);
        if(!isIdPeriodValid){
            return res.status(400).json({
                success : false,
                httpCode : 400,
                message : 'Id periodo invalido'
            });
        }

        const isIdStudentValid = mongoose.isValidObjectId(req.params.idStudent);
        if(!isIdStudentValid){
            return res.status(400).json({
                success : false,
                httpCode : 400,
                message : 'Id alumno invalido'
            });
        }

        await periodService.addStudentToPeriod(req.params.idStudent, req.params.idPeriod)

        return res.status(200).json({
            success : true,
            httpCode : 200,
            message : 'Alumno agregado al periodo escolar'
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

export const allPeriods = async(req, res) => {
    try {
       const periods = await periodService.allPeriods(req.query); 
       console.log(periods)

       return res.status(200).json({
            success: true,
            httpCode : 200,
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

export const deletePeriod = async(req, res) => {
    try {
        const isIdValid = mongoose.isValidObjectId(req.params.id);
        if(!isIdValid){
            return res.status(400).json({
                success : false,
                httpCode : 400,
                message : 'Id invalido'
            });
        }

        await periodService.deletePeriodById(req.params.id);

        return res.status(200).json({
            success : true,
            httpCode : 200,
            message : 'Periodo eliminado'
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