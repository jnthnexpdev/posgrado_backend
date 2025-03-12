import mongoose from 'mongoose';

import AppError from '../../utils/errors/server_errors.mjs';
import * as publicationsService from '../../services/entities/publication_service.mjs';
import * as userUtils from '../../utils/users/data_users.mjs';
import { handleServerError } from '../../utils/errors/error_handle.mjs';

// Registrar una nueva publicacion
export const registerPublication = async(req, res) => {
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

        await publicationsService.registerPublication(req.body, student._id);
        return res.status(201).json({
            success : true,
            httpCode : 201,
            message : 'Publicacion registrada',
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

// Obtener la publicacion de tesis de un alumno
export const getPublicationOfStudent = async(req, res) => {
    try {
        const student = await userUtils.getDataUserFromCookie(req);
        if(!student){
            return res.status(404).json({
                success : false,
                httpCode : 404,
                message : 'No existe el alumno'
            });
        }

        const publication = await publicationsService.getPublicationOfStudent(student._id);
        return res.status(200).json({
            success : true,
            httpCode : 200,
            message : 'Publicacion encontrada',
            publication
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

// Actualizar datos de una publicacion {revista, url, fecha publicacion}
export const updatePublicationInfo = async(req, res) => {
    try {
        const id = req.params.id;
        const isIdValid = mongoose.isValidObjectId(id);
        if(!isIdValid){
            return res.status(400).json({
                success : false,
                httpCode : 400,
                message : 'Id publicacion invalido'
            });
        }

        await publicationsService.updatePublicationInfo(id, req.body);

        return res.status(200).json({
            success : true,
            httpCode : 200,
            message : 'Informacion publicacion actualizada'
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