import { getDateTime } from '../../utils/datetime.mjs';
import periodModel from '../../models/entities/period_model.mjs';
import AppError from '../../utils/errors/server_errors.mjs';

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

export const allPeriods = async(queryParams) => {
    try {
        console.log(queryParams)
        let { search = '', page = 1, pageSize = 1 } = queryParams;
        if(search != ''){
            page = 1;
        }

        const searchRegex = new RegExp(search, 'i');
        const filter = {
            $or: [
                { periodo : searchRegex }
            ]
        };

        const periods = await periodModel
        .find(filter)
        .skip((page - 1) * pageSize)
        .limit(pageSize);

        const total = await periodModel.countDocuments(filter);

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