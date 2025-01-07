import mongoose from 'mongoose';
import advisorAssignmentModel from '../../models/entities/advisor_assingnment_model.mjs';
import studentModel from '../../models/users/student_model.mjs';
import teacherModel from '../../models/users/teacher_model.mjs';
import { getDateTime } from '../../utils/datetime.mjs';
import AppError from '../../utils/errors/server_errors.mjs';
import student from '../../models/users/student_model.mjs';

export const advisorAssignment = async(idTeacher, body) => {
    try {
        const { hora, fecha } = await getDateTime();

        const student = await studentModel.findById(body.alumno);
        if(!student){
            throw new AppError("Alumno no encontrado");
        }

        const newAdvisorAssignment = new advisorAssignmentModel({
            asesor : idTeacher,
            alumno : student._id,
            fechaAsignacion : fecha,
            periodo : body.periodo,
            notas : body.notas
        });

        await newAdvisorAssignment.save();

        return newAdvisorAssignment;
    } catch (error) {
        throw error;
    }
}

export const studentsAdvised = async(idTeacher, page = 1, pageSize = 10, search = '') => {
    try {
        const adviseds = await advisorAssignmentModel
        .find({ asesor: idTeacher }) 
        .populate('alumno', 'nombre correo')
        .lean();

        if (!adviseds.length) {
            throw new AppError('No se encontraron alumnos asesorados para este asesor.', 404);
        }

        const filteredAdviseds = adviseds.filter(advised => {
            const searchRegex = new RegExp(search, 'i');
            return(
                searchRegex.test(advised.alumno.nombre) || 
                searchRegex.test(advised.alumno.correo)
            );
        });

        const totalStudents = filteredAdviseds.length;
        const totalPages = Math.ceil(totalStudents / pageSize);
        const paginatedAdviseds = filteredAdviseds.slice((page - 1) * pageSize, page * pageSize );

        return {
            students: paginatedAdviseds,
            currentPage: page,
            totalPages,
            totalStudents,
        };
    } catch (error) {
        throw error;
    }
}

export const detailsAdvice = async(idAssignment) => {
    try {
        const assignment = await advisorAssignmentModel.findById(idAssignment);
        if(!assignment){
            throw new AppError("El asesoramiento no existe", 404);
        }

        const student = await studentModel.findById(assignment.alumno).select('-password');
        if(!student){
            throw new AppError("El alumno no existe", 404);
        }

        const teacher = await teacherModel.findById(assignment.asesor).select('-password');
        if(!teacher){
            throw new AppError("El/la asesor/a no existe", 404);
        }

        return { assignment, student, teacher };
    } catch (error) {
        throw error;
    }
}

export const deleteAdvisor = async(idAssignment) => {
    try {
        const assignment = await advisorAssignmentModel.findById(idAssignment);
        if(!assignment){
            throw new AppError("El asignamiento no existe");
        }

        await advisorAssignmentModel.findByIdAndDelete(idAssignment);

        return true;
    } catch (error) {
        throw error;
    }
}