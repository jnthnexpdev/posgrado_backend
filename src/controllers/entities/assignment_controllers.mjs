import mongoose from 'mongoose';

import AppError from '../../utils/errors/server_errors.mjs';
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