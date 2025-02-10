import { getDateTime } from '../../utils/datetime.mjs';
import tesisModel from '../../models/entities/tesis_model.mjs';
import AppError from '../../utils/errors/server_errors.mjs';

import mongoose from 'mongoose';

export const registerTesis = async(tesisData, idStudent, idTeacher) => {
    try {
        const { fecha } = await getDateTime();

        const newTesis = new tesisModel({
            titulo : tesisData.titulo,
            alumno : idStudent,
            asesor : idTeacher,
            fechaInicio : fecha,
            areaConocimiento : tesisData.areaConocimiento,
        });

        await newTesis.save();

        return newTesis;
    } catch (error) {
        throw error;
    }
}

export const getTesisByStudent = async(idStudent) => {
    try {
        const tesis = await tesisModel.findOne({ alumno : idStudent });
        if(!tesis){
            throw new AppError("No hay una tesis vinculada al alumno");
        }

        return tesis;
    } catch (error) {
        throw error;
    }
}