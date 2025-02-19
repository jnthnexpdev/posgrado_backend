import mongoose from 'mongoose';

import AppError from '../../utils/errors/server_errors.mjs';
import * as teacherService from '../../services/users/teacher_service.mjs';
import { handleServerError } from '../../utils/errors/error_handle.mjs';
import { exportTeachers } from '../../utils/pdfs/export_teacher.mjs';

export const registerTeacherAccount = async(req, res) => {
    try {
        const teacherData = req.body;
        const newTeacher = await teacherService.saveTeacherUser(teacherData);

        return res.status(201).json({
            success : true,
            httpCode : 201,
            message : 'Asesor guardado',
            teacherAccount : newTeacher
        });

    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.httpCode).json({
                success: false,
                httpCode: error.httpCode,
                message: error.message,
            });
        }
        handleServerError(res, error);
    }
}

export const allTeachersAccounts = async(req, res) => {
    try {
        const teachersInfo = await teacherService.allTeachersUsers(req.query);

        return res.status(200).json({
            success: true,
            httpCode : 200,
            message: 'Asesores obtenidos correctamente',
            teachers: teachersInfo.teachers,
            pagination: teachersInfo.pagination
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

export const exportTeachersPDF = async (req, res) => {
    try {
        console.time('TotalTime'); // Inicio del contador general

        console.time('FetchingTeachers'); // Contador para el tiempo de obtención de los docentes
        const teachers = await teacherService.allTeachersUsers(req.query);
        console.timeEnd('FetchingTeachers'); // Fin del contador de obtención de docentes

        console.time('ExportingPDF'); // Contador para el tiempo de exportación del PDF
        const buffer = await exportTeachers(teachers.teachers);
        console.timeEnd('ExportingPDF'); // Fin del contador de exportación del PDF

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="asesores.pdf"',
            'Content-Length': buffer.length
        });
        res.end(buffer);

        console.timeEnd('TotalTime'); // Fin del contador general

    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.httpCode).json({
                success: false,
                httpCode: error.httpCode,
                message: error.message,
            });
        }
        handleServerError(res, error);
    }
}


export const deleteTeacherAccount = async(req, res) => {
    try {

        const id = req.params.id;
        const isIdValid = mongoose.isValidObjectId(id);
        if(!isIdValid){
            return res.status(404).json({
                success : false,
                httpCode : 404,
                message : 'El id es invalido',
            });
        }

        await teacherService.deleteTeacherUser(id);

        return res.status(201).json({
            success : true,
            httpCode : 201,
            message : 'Cuenta eliminada',
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