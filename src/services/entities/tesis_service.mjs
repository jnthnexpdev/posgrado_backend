import { getDateTime } from '../../utils/datetime.mjs';
import tesisModel from '../../models/entities/tesis_model.mjs';
import AppError from '../../utils/errors/server_errors.mjs';

// Registrar nueva tesis
export const registerTesis = async(tesisData, idStudent, idTeacher) => {
    try {

        const tesisDuplicated = await tesisModel.findOne({ alumno : idStudent });
        if(tesisDuplicated){
            throw new AppError("El alumno ya cuenta con una tesis registrada", 400);
        }

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

// Obtener la tesis de un estudiante
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