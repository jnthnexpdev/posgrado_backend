import mongoose from 'mongoose';

import AppError from '../../utils/errors/server_errors.mjs';
import * as revisionService from '../../services/entities/revision_service.mjs';
import * as userUtils from '../../utils/users/data_users.mjs';
import { handleServerError } from '../../utils/errors/error_handle.mjs';

export const createRevision = async(req, res) => {
    try {
        const user = await userUtils.getDataUserFromCookie(req);
        const idAssignment = req.body._id;
        const isIdValid = mongoose.isValidObjectId(idAssignment);
        if(!isIdValid){
            return res.status(400).json({
                success : false,
                httpCode : 400,
                message : 'Id asignacion invalido'
            });
        }

        await revisionService.registerRevision(user._id ,req.body);

        return res.status(201).json({
            success : true,
            httpCode : 201,
            message : 'Entrega enviada'
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

export const getRevision = async(req, res) => {
    try {
        const idStudent = await userUtils.getDataUserFromCookie(req);

        const idAssignment = req.params.idAssignment;
        const isIdValid = mongoose.isValidObjectId(idAssignment);
        if(!isIdValid){
            return res.status(400).json({
                success : false,
                httpCode : 400,
                message : 'Id asignacion invalido'
            });
        }

        const revision = await revisionService.revisionByStudentAndAssignment(idStudent, idAssignment);

        return res.status(200).json({
            success : true,
            httpCode : 200,
            message : 'Revision encontrada',
            revision
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