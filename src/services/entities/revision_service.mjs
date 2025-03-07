import mongoose from 'mongoose';

import { getDateTime } from '../../utils/datetime.mjs';
import revisionModel from '../../models/entities/revision_model.mjs';
import studentModel from '../../models/users/student_model.mjs';
import tesisModel from '../../models/entities/tesis_model.mjs';
import AppError from '../../utils/errors/server_errors.mjs'

// Registar una nueva revision, es decir, una entrega de un alumno
export const registerRevision = async(idStudent, assignmentData) => {
    try {
        if(!assignmentData){
            throw new AppError("La informacion de la entrega esta incompleta", 400);
        }
        const { fecha, hora } = await getDateTime();
        const tesis = await tesisModel.findOne({ alumno : idStudent });

        const newRevision = new revisionModel({
            idAsignacion : assignmentData._id,
            nombreAsignacion : assignmentData.nombre,
            fechaAsignacion : assignmentData.fechaAsignacion,
            alumno : idStudent,
            tesis : tesis,
            linkEntrega : assignmentData.linkEntrega,
            estatusEntrega : 'Entregada',
            fechaEntrega : fecha,  
            horaEntrega : hora, 
        });

        await newRevision.save();

        return true;
    } catch (error) {
        throw error;
    }
}

// Todas las entregas de una asignacion
export const allRevisionsOfAssignment = async(idAssignment) => {
    try {
        const revisions = await revisionModel.find({idAsignacion : idAssignment});

        if(!revisions || revisions.length === 0){
            throw new AppError("Por el momento no ahy entregas para esta asignacion", 404);
        }

        const idStudents = revisions.map(revision => revision.alumno);

        const students = await studentModel.find({ _id : { $in : idStudents }}, { nombre : 1 });

        const studentMap = students.reduce((acc, student) => {
            acc[student._id.toString()] = student.nombre;
            return acc;
        }, {});

        const revisionsWithNames = revisions.map(revision => ({
            ...revision.toObject(),
            nombreAlumno: studentMap[revision.alumno.toString()] || "Desconocido"
        }));

        return revisionsWithNames;

    } catch (error) {
        
    }
}

// Buscar una entrega de una alumno y de determinada asignacion
export const revisionByStudentAndAssignment = async(idStudent, idAssignment) => {
    try {
        const revision = await revisionModel.findOne({ alumno : idStudent, idAsignacion : idAssignment  });

        return revision;
    } catch (error) {
        throw error;
    }
}

// Asignar o actualizar la calificacion de la entrega de un alumno
export const updateRatingOfRevision = async(idRevision, rating) => {
    try {
        const revision = await revisionModel.findById(idRevision);
        if(!revision){
            throw new AppError("No se ha podido asignar la calificación debido a que la entrega no existe", 404);
        }

        await revisionModel.findByIdAndUpdate(idRevision, { calificacion : rating }, { new : true });

        return true;
    } catch (error) {
        throw error;
    }
}