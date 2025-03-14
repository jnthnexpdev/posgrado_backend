import mongoose from 'mongoose';

import AppError from '../../utils/errors/server_errors.mjs';
import * as tesisService from '../../services/entities/tesis_service.mjs';
import * as userUtils from '../../utils/users/data_users.mjs';
import { handleServerError } from '../../utils/errors/error_handle.mjs';

// Registrar una nueva tesis
export const registerTesis = async(req, res) => {
    try {
        const student = await userUtils.getDataUserFromCookie(req);

        const studentIdValid = mongoose.isValidObjectId(student._id);
        if(!studentIdValid){ 
            return res.status(400).json({
                success: false,
                httpCode: 400,
                message: 'Id alumno invalido',
            });
        }

        if(!req.body){ 
            return res.status(400).json({
                success: false,
                httpCode: 400,
                message: 'Datos incompletos',
            });
        }

        const tesis = await tesisService.registerTesis(req.body, student._id);
        return res.status(201).json({
            success : true,
            httpCode : 201,
            message : 'Tesis registrada',
            tesis
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

// Obtener la tesis de un alumno
export const getTesisByStudent = async(req, res) => {
    try {
        const student = await userUtils.getDataUserFromCookie(req);
        if(!student){
            return res.status(404).json({
                success : false,
                httpCode : 404,
                message : 'No existe el alumno'
            });
        }

        const tesis = await tesisService.getTesisByStudent(student._id);
        return res.status(200).json({
            success : true,
            httpCode : 200,
            message : 'Tesis encontrada',
            tesis
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

// Obtener todas las tesis de un periodo
export const getAllTesisOfPeriod = async(req, res) => {
    try {
        const period = req.params.period;
        if(!period){
            return res.status(400).json({
                success : false,
                httpCode : 400,
                message : 'Periodo invalido'
            });
        }

        const tesisData = await tesisService.getAllTesis(period);

        return res.status(200).json({
            success : true,
            httpCode : 200,
            message : 'Tesis encontradas',
            tesis : tesisData
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

// Actualizar datos de una tesis {titulo, url, area de conocimiento, resumen}
export const updateTesisInfo = async(req, res) => {
    try {
        const idTesis = req.params.idTesis;
        const isIdValid = mongoose.isValidObjectId(idTesis);
        if(!isIdValid){
            return res.status(400).json({
                success : false,
                httpCode : 400,
                message : 'Id tesis invalido'
            });
        }

        await tesisService.updateTesis(idTesis, req.body);

        return res.status(200).json({
            success : true,
            httpCode : 200,
            message : 'Informacion tesis actualizada'
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

// Aprobar una tesis de un alumno por parte del coordinador de posgrado
export const approveTesis = async(req, res) => {
    try {
        const user = await userUtils.getDataUserFromCookie(req);
        const idTesis = req.params.idTesis;
        const isIdValid = mongoose.isValidObjectId(idTesis);
        if(!isIdValid){
            return res.status(400).json({
                success : false,
                httpCode : 400,
                message : 'Id tesis invalido'
            });
        }

        await tesisService.approveTesisByAdmin(idTesis, user.nombre);

        return res.status(200).json({
            success : true,
            httpCode : 200,
            message : 'Tesis aprobada'
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

// Desaprobar una tesis de un alumno por parte del coordinador de posgrado
export const disapproveTesis = async(req, res) => {
    try {
        const idTesis = req.params.idTesis;
        const isIdValid = mongoose.isValidObjectId(idTesis);
        if(!isIdValid){
            return res.status(400).json({
                success : false,
                httpCode : 400,
                message : 'Id tesis invalido'
            });
        }

        await tesisService.disapproveTesisByAdmin(idTesis);

        return res.status(200).json({
            success : true,
            httpCode : 200,
            message : 'Tesis desaprobada'
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

// Rechazar tesis de un alumno por parte del coordinador de posgrado
export const rejectTesis = async(req, res) => {
    try {
        const idTesis = req.params.idTesis;
        const isIdValid = mongoose.isValidObjectId(idTesis);
        if(!isIdValid){
            return res.status(400).json({
                success : false,
                httpCode : 400,
                message : 'Id tesis invalido'
            });
        }

        const user = await userUtils.getDataUserFromCookie(req);

        await tesisService.rejectTesisByAdmin(idTesis);

        return res.status(200).json({
            success : true,
            httpCode : 200,
            message : 'Tesis rechazada'
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

// Preaprobar una tesis de un alumno por parte de su asesor de tesis
export const preapproveTesis = async(req, res) => {
    try {
        const idStudent = req.params.idStudent;
        console.log(idStudent);
        const isIdValid = mongoose.isValidObjectId(idStudent);
        if(!isIdValid){
            return res.status(400).json({
                success : false,
                httpCode : 400,
                message : 'Id alumno invalido'
            });
        }

        await tesisService.preapproveTesisByTeacher(idStudent);

        return res.status(200).json({
            success : true,
            httpCode : 200,
            message : 'Tesis lista para aprobación por parte de coordinación'
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