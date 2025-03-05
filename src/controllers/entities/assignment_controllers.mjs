import mongoose from 'mongoose';

import AppError from '../../utils/errors/server_errors.mjs';
console.log('AppError:', AppError);
import * as assignmentService from '../../services/entities/assignment_service.mjs';
import * as userUtils from '../../utils/users/data_users.mjs';
import { handleServerError } from '../../utils/errors/error_handle.mjs';

// Regisrtar una nueva asignacion en el sistema
export const registerAssignment = async(req, res) => {
    try {
        const teacher = await userUtils.getDataUserFromCookie(req);
        const body = req.body;

        const assignment = await assignmentService.newAssignment(body, teacher);

        return res.status(201).json({
            success : true,
            httpCode : 201,
            message : 'Tarea asignada',
            assignment
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

// Asignaciones creadas de un asesor en determinado periodo
export const assignmentsOfAdvisorByPeriod = async(req, res) => {
    try {
        const teacher = await userUtils.getDataUserFromCookie(req);
        const period = req.params.period;

        const assignments = await assignmentService.assignmentByTeacherAndPeriod(teacher._id, period, req.query);

        return res.status(200).json({
            success : true,
            httpCode : 200,
            message : 'Asignaciones encontradas',
            assignments : assignments.assignments,
            pagination : assignments.pagination
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

// Asignaciones de un estudiante en determinado periodo
export const assignmentsOfStudent = async(req, res) => {
    try {
        const period = req.params.period;
        const idStudent = await userUtils.getDataUserFromCookie(req);
        const assignments = await assignmentService.getAssignmentByStudent(idStudent, period);

        return res.status(200).json({
            success : true,
            httpCode : 200,
            message : 'Asignaciones encontrada',
            assignments
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

// Obtener la informacion de una asignacion mediante id
export const getAssignmentById = async(req, res) => {
    try {
        const id = req.params.id;
        const isIdValid = mongoose.isValidObjectId(id);
        if(!isIdValid){
            return res.status(400).json({
                success : false,
                httpCode : 400,
                message : 'Id asignacion invalido'
            });
        }

        const assignment = await assignmentService.assignmentById(id);

        return res.status(200).json({
            success : true,
            httpCode : 200,
            assignment : assignment
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

// Actualizar datos de una asignacion {titulo, descripcion, periodo, fecha limite}
export const updateAssignment = async(req, res) => {
    try {
        const id = req.params.id;
        const isIdValid = mongoose.isValidObjectId(id);
        if(!isIdValid){
            return res.status(400).json({
                success : false,
                httpCode : 400,
                message : 'Id asignacion invalido'
            });
        }

        await assignmentService.updateAssignmentData(id, req.body);

        return res.status(200).json({
            success : true,
            httpCode : 200,
            message : 'Informacion asignacion actualizada'
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

// Eliminar asignacion mediante id
export const deleteAssingment = async(req, res) => {
    try {
        const isIdValid = mongoose.isValidObjectId(req.params.id);
        if(!isIdValid){
            return res.status(400).json({
                success : false,
                httpCode : 400,
                message : 'Id asignacion invalido'
            });
        }

        await assignmentService.deleteAssingmentById(req.params.id);

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