import mongoose from 'mongoose';

import AppError from '../../utils/errors/server_errors.mjs';
import * as assignmentService from '../../services/entities/advisor_assingnment_service.mjs';
import * as userUtils from '../../utils/users/data_users.mjs';
import { handleServerError } from '../../utils/errors/error_handle.mjs';
import { exportAdvised } from "../../utils/pdfs/export_advised.mjs";

// Registrar asesoramiento
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

        const controlNumber = req.body.numeroControl;
        const advisorAssignment = await assignmentService.advisorAssignment(teacherData._id, controlNumber, req.body);
        
        return res.status(201).json({
            success : true,
            httpCode : 201,
            message : 'Asesoramiento registrado',
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

// Alumnos asesorados por un profesor
export const searchAdvisedsByTeacher = async(req, res) => {
    try {
        const teacher = await userUtils.getDataUserFromCookie(req);
        const idIsValid = mongoose.isValidObjectId(teacher._id);
        if(!idIsValid){
            return res.status(400).json({
                success : false,
                httpCode : 400,
                message : 'Id asesor invalido'
            });
        }

        const adviseds = await assignmentService.studentsAdvised(teacher._id, req.params.period, req.query);

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

// Detalles de un asesoramiento
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

// Exportar alumnos asesorados en un periodo
export const exportAdvicedByPeriodPDF = async(req, res) => {
    try {
        const teacher = await userUtils.getDataUserFromCookie(req);
        const idIsValid = mongoose.isValidObjectId(teacher._id);
        if(!idIsValid){
            return res.status(400).json({
                success : false,
                httpCode : 400,
                message : 'Id asesor invalido'
            });
        }
        
        const students = await assignmentService.studentsAdvised(teacher._id, req.params.period, req.query);

        const buffer = await exportAdvised(students.students, teacher.nombre, req.params.period);
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="asesorados.pdf"',
            'Content-Length': buffer.length
        });
        res.end(buffer);

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

// Eliminar asesoramiento
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