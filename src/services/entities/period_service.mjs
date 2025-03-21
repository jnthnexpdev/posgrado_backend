import mongoose from 'mongoose';

import { getDateTime } from '../../utils/datetime.mjs';
import periodModel from '../../models/entities/period_model.mjs';
import studentModel from '../../models/users/student_model.mjs';
import AppError from '../../utils/errors/server_errors.mjs'

// Registrar periodo en el sistema
export const registerNewPeriod = async(periodData) => {
    try {
        const { hora, fecha } = await getDateTime();

        if(!periodData){
            throw new AppError("La informacion del periodo esta incompleta", 400);
        }

        const period = new periodModel({
            periodo : periodData,
            fechaRegistro : fecha,
            horaRegistro : hora
        });

        await period.save();

        return period;
    } catch (error) {
        throw error;
    }
}

// Agregar alumno a un periodo seleccionado
export const addStudentToPeriod = async(idStudent, idPeriod) => {
    try {
        const period = await periodModel.findById(idPeriod);
        if(!period){
            throw new AppError("El periodo no existe", 404);
        }

        if(period.alumnos.includes(idStudent)){
            throw new AppError("El alumno ya esta registrado en el periodo", 400);
        }

        period.alumnos.push(idStudent);

        await period.save();

        return true;
    } catch (error) {
        throw error;
    }
}

// Obtener la informacion de todos los periodos registrados en el sistema
export const allPeriods = async(queryParams) => {
    try {
        let { search = '', page = 1, pageSize = 20 } = queryParams;
        if (search !== '') {
            page = 1;
        }

        const searchRegex = new RegExp(search, 'i');

        // Obtener los periodos con alumnos
        const periods = await periodModel
            .find({ periodo: searchRegex })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean();

        if (periods.length === 0) {
            throw new AppError('No hay periodos registrados en el sistema', 404);
        }

        // Obtener los IDs únicos de alumnos en todos los periodos
        const allStudentIds = [...new Set(periods.flatMap(period => period.alumnos))];

        // Obtener solo los alumnos que realmente existen en la base de datos
        const existingStudentIds = new Set(
            (await studentModel.find({ _id: { $in: allStudentIds } }, { _id: 1 })).map(s => s._id.toString())
        );

        // Filtrar los periodos eliminando alumnos inexistentes
        const updatedPeriods = await Promise.all(periods.map(async (period) => {
            const validStudentIds = period.alumnos.filter(id => existingStudentIds.has(id.toString()));

            if (validStudentIds.length !== period.alumnos.length) {
                await periodModel.updateOne({ _id: period._id }, { alumnos: validStudentIds });
            }

            return { ...period, alumnos: validStudentIds };
        }));

        // Obtener el conteo total de periodos
        const total = await periodModel.countDocuments({ periodo: searchRegex });

        return {
            periods: updatedPeriods,
            pagination: {
                total,
                page: Number(page),
                pageSize: Number(pageSize),
                totalPages: Math.ceil(total / pageSize)
            }
        };
    } catch (error) {
        throw error;
    }
}

// Informacion de todos los alumnos de un periodo seleccionado por id
export const studentsDataByPeriod = async (idPeriod, queryParams) => {
    try {
        const { search = '', page = 1, pageSize = 50 } = queryParams;
        const searchRegex = new RegExp(search, 'i');

        const periodData = await periodModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(idPeriod) }
            },
            {
                $lookup: {
                    from: 'alumnos',
                    localField: 'alumnos',
                    foreignField: '_id',
                    as: 'students'
                }
            },
            {
                $unwind: "$students"
            },
            {
                $match: {
                    $or: [
                        { "students.nombre": searchRegex },
                        { "students.correo": searchRegex }
                    ]
                }
            },
            {
                $project: {
                    _id: "$students._id",
                    nombre: "$students.nombre",
                    correo: "$students.correo",
                    numeroControl: "$students.numeroControl",
                    fechaRegistro: "$students.fechaRegistro",
                    estatusCuenta: "$students.estatusCuenta"
                }
            },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    students: [{ $skip: (page - 1) * pageSize }, { $limit: parseInt(pageSize) }]
                }
            }
        ]);

        if (!periodData || periodData.length === 0) {
            throw new AppError("El periodo no existe o no tiene alumnos registrados", 404);
        }

        const total = periodData[0].metadata.length > 0 ? periodData[0].metadata[0].total : 0;
        const totalPages = Math.ceil(total / pageSize);

        return {
            students: periodData[0].students,
            pagination: {
                total,
                page: Number(page),
                pageSize: Number(pageSize),
                totalPages
            }
        };
    } catch (error) {
        throw error;
    }
};

// Eliminar un periodo mediante id
export const deletePeriodById = async(idPeriod) => {
    try {
        const period = await periodModel.findByIdAndDelete(idPeriod);

        if(!period){
            throw new AppError("El periodo no existe", 404);
        }

        await periodModel.findByIdAndDelete(idPeriod);

        return true;
    } catch (error) {
        throw error;
    }
}