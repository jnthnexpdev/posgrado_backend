import mongoose from 'mongoose';

import AppError from '../../utils/errors/server_errors.mjs';
import * as tesisService from '../../services/entities/tesis_service.mjs';
import * as userUtils from '../../utils/users/data_users.mjs';
import { handleServerError } from '../../utils/errors/error_handle.mjs';

// REgistrar una nueva tesis
export const registerTesis = async(req, res) => {
    try {
        const student = await userUtils.getDataUserFromCookie(req);
        const teacher = await userUtils.getDataUserById(req.body.asesor);

        const studentIdValid = mongoose.isValidObjectId(student._id);
        if(!studentIdValid){ 
            return res.status(400).json({
                success: false,
                httpCode: 400,
                message: 'Id alumno invalido',
            });
        }

        const teacherIdValid = mongoose.isValidObjectId(teacher._id);
        if(!teacherIdValid){ 
            return res.status(400).json({
                success: false,
                httpCode: 400,
                message: 'Id asesor invalido',
            });
        }

        if(!req.body){ 
            return res.status(400).json({
                success: false,
                httpCode: 400,
                message: 'Datos incompletos',
            });
        }

        const tesis = await tesisService.registerTesis(req.body, student._id, teacher._id);
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

// Actualizar datos de una tesis {titulo, url, area de conocimiento, resumen}
export const updateTesisInfo = async(req, res) => {
    try {
        const id = req.params.id;
        const isIdValid = mongoose.isValidObjectId(id);
        if(!isIdValid){
            return res.status(400).json({
                success : false,
                httpCode : 400,
                message : 'Id tesis invalido'
            });
        }

        await tesisService.updateTesis(id, req.body);

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