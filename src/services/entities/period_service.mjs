import { getDateTime } from '../../utils/datetime.mjs';
import periodModel from '../../models/entities/period_model.mjs';
import AppError from '../../utils/errors/server_errors.mjs';

import mongoose from 'mongoose';

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

export const allPeriods = async(queryParams) => {
    try {
        let { search = '', page = 1, pageSize = 20 } = queryParams;
        if(search != ''){
            page = 1;
        }

        const searchRegex = new RegExp(search, 'i');

        const periods = await periodModel
            .find({ periodo : searchRegex })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        const total = await periodModel.countDocuments({ periodo : searchRegex });

        if(periods.length === 0){
            throw new AppError('No hay periodos registrados en el sistema', 404);
        }

        return {
            periods,
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

export const studentsDataByPeriod = async (idPeriod, queryParams) => {
    try {
        const { search = '', page = 1, pageSize = 10 } = queryParams;
        const searchRegex = new RegExp(search, 'i');

        const periodData = await periodModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(idPeriod) }
            },
            {
                $lookup: {
                    from: 'alumnos', // Nombre de la colección de alumnos en MongoDB
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