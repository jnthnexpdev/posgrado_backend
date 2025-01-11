import mongoose from 'mongoose';

import AppError from '../../utils/errors/server_errors.mjs';
import * as assignmentService from '../../services/entities/advisor_assingnment_service.mjs';
import * as userUtils from '../../utils/users/data_users.mjs';
import { handleServerError } from '../../utils/errors/error_handle.mjs';

export const registerAdviced = async(req, res) => {
    try {
        const teacherData = await userUtils.getDataUserFromCookie(req);
        if(!teacherData){
            return res.status(404).json({
                success : false,
                httpCode : 404,
                message : 'Asesor no encontrado'
            });
        }

        if(!req.body){
            return res.status(400).json({
                success : false,
                httpCode : 400,
                message : 'Informacion incompleta, por favor verifica que los datos esten completos'
            }); 
        }

        const advisorAssignment = await assignmentService.advisorAssignment(teacherData._id, req.body);
        
        return res.status(201).json({
            success : true,
            httpCode : 201,
            message : 'Informacion guardada',
            data : advisorAssignment
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
};

export const searchAdvisedsByTeacher = async(req, res) => {
    try {
        const teacher = await userUtils.getDataUserFromCookie(req);
        const { page = 1, pageSize = 10, search = '' } = req.query;
        const idIsValid = mongoose.isValidObjectId(teacher._id, Number(page), Number(pageSize), search);

        if(!idIsValid){
            return res.status(400).json({
                success : false,
                httpCode : 400,
                message : 'Id asesor invalido'
            });
        }

        const adviseds = await assignmentService.studentsAdvised(teacher._id);

        if(adviseds.students.length <= 0){
            return res.status(400).json({
                success : false,
                httpCode : 404,
                message : 'No hay alumnos asesorados'
            });
        }

        return res.status(200).json({
            success : true,
            httpCode : 200,
            ...adviseds
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

export const detailsAdvice = async(req, res) => {
    try {
        const idIsValid = mongoose.isValidObjectId(req.params.id);
        if(!idIsValid){
            return res.status(400).json({
                success : false,
                httpCode : 400,
                message : 'Id asignacion invalido'
            });
        }

        const { assignment, student, teacher } = await assignmentService.detailsAdvice(req.params.id);
        
        return res.status(200).json({
            success : true,
            httpCode : 200,
            assignment,
            student,
            teacher
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

export const deleteAdviced = async(req, res) => {
    try {
        const idIsValid = mongoose.isValidObjectId(req.params.id);
        if(!idIsValid){
            return res.status(400).json({
                success : false,
                httpCode : 400,
                message : 'Id asignacion invalido'
            });
        }

        await assignmentService.deleteAdvisor(req.params.id);
        
        return res.status(200).json({
            success : true,
            httpCode : 200,
            message : 'Asignacion eliminada'
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