import mongoose from 'mongoose';

import { getDateTime } from '../../utils/datetime.mjs';
import revisionModel from '../../models/entities/revision_model.mjs';
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
            estatusEntrega : 'entregada',
            fechaEntrega : fecha,  
            horaEntrega : hora, 
        });

        await newRevision.save();

        return true;
    } catch (error) {
        throw error;
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