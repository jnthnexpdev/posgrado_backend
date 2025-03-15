import { getDateTime } from '../../utils/datetime.mjs';
import publicationModel from '../../models/entities/publications_model.mjs';
import AppError from '../../utils/errors/server_errors.mjs';

// Registrar nueva publicacion
export const registerPublication = async(data, idStudent) => {
    try {
        const publication = await publicationModel.findOne({ alumno : idStudent });
        if(publication){
            throw new AppError("Ya cuentas con una publicacion registrada", 400);
        }

        const { fecha } = await getDateTime();

        const newPublication = new publicationModel({
            revista : data.revista,
            alumno : idStudent,
            url : data.url,
            fechaPublicacion : data.fechaPublicacion,
            fechaRegistro : fecha
        });

        await newPublication.save();

        return true;
    } catch (error) {
        throw error;
    }
}

// Obtener la tesis de un estudiante
export const getPublicationOfStudent = async(idStudent) => {
    try {
        const publication = await publicationModel.findOne({ alumno : idStudent });
        if(!publication){
            throw new AppError("No hay una publicacion registrada por el alumno", 404);
        }

        return publication;
    } catch (error) {
        throw error;
    }
}

// Actualizar datos de una publicacion
export const updatePublicationInfo = async(idPublication, data) => {
    try {
        // Validar si la publicacion existe
        const publication = await publicationModel.findById(idPublication);
        if(!publication){
            throw new AppError("Publicacion no encontrada", 404);
        }

        const updateFields = {};

        // Validar campos a actualizar
        if(data.revista){ updateFields.revista = data.revista }
        if(data.url){ updateFields.url = data.url }
        if(data.fechaPublicacion){ updateFields.fechaPublicacion = data.fechaPublicacion }

        const newPublicationData = await publicationModel.findByIdAndUpdate(idPublication, updateFields, { new : true });

        return newPublicationData;
    } catch (error) {
        throw error;
    }
}

// ELiminar la publicacion relacionada a un estudiante
export const deletePublicationOfStudent = async(idStudent) => {
    try {
        await publicationModel.findOneAndDelete({ alumno : idStudent });

        return true;
    } catch (error) {
        throw error;
    }
}