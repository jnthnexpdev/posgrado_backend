import mongoose from 'mongoose';

import AppError from '../../utils/errors/server_errors.mjs';
import * as studentService from '../../services/users/student_service.mjs';
import { handleServerError } from '../../utils/errors/error_handle.mjs';
import { exportStudents } from '../../utils/pdfs/export_students.mjs';

export const registerStudentAccount = async(req, res) => {
    try {
        const studentData = req.body;
        const newStudent = await studentService.saveStudentUser(studentData);

        return res.status(201).json({
            success : true,
            httpCode : 201,
            message : 'Alumno guardado',
            studentId : newStudent._id,
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

export const allStudentsAccounts = async(req, res) => {
    try {
        const studentsInfo = await studentService.allStudentsUsers(req.query);

        return res.status(200).json({
            success: true,
            message: 'Alumnos obtenidos correctamente',
            students: studentsInfo.students,
            pagination: studentsInfo.pagination
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

export const exportStudentsByPeriodPDF = async(req, res) => {
    try {
        const students = await studentService.allStudentsUsers(req.query);

        const buffer = await exportStudents(students.students);
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="alumnos.pdf"',
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

export const deleteStudentAccount = async(req, res) => {
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

        await studentService.deleteStudentsUser(id);

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