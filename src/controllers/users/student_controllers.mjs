import mongoose from 'mongoose';

import AppError from '../../utils/errors/server_errors.mjs';
import * as studentService from '../../services/users/student_service.mjs';
import { handleServerError } from '../../utils/errors/error_handle.mjs';
import { exportStudents } from '../../utils/pdfs/export_students.mjs';
import { registerStudentsCSV } from '../../utils/csv/register_students.mjs'

// Crear cuenta de alumno
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

// Registrar varios alumnos desde un archivo CSV y agregarlos a un periodo seleccionado
export const registerStudentsFromCSV = async (req, res) => {
    try {
        const idPeriod = req.params.idPeriod;

        if (!mongoose.isValidObjectId(idPeriod)) {
            return res.status(400).json({
                success: false,
                httpCode: 400,
                message: 'Id de periodo inválido'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                httpCode: 400,
                message: 'No se ha subido ningún archivo CSV'
            });
        }

        const result = await registerStudentsCSV(req.file.buffer, idPeriod, req.body.password);

        return res.status(201).json({
            success: true,
            httpCode: 201,
            message: result.message,
            result: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            httpCode: 400,
            message: 'Error al procesar el archivo CSV',
            error: error.message
        });
    }
};

// Obtener las cuentas de todos los alumnos
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

// Exportar en pdf todos los alumnos de un periodo
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

// Eliminar la cuenta de un alumno mediante id
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

        await studentService.deleteStudentUser(id);

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