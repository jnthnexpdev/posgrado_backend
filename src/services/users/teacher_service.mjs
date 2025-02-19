import teacherModel from '../../models/users/teacher_model.mjs';
import { getDateTime } from '../../utils/datetime.mjs';
import AppError from '../../utils/errors/server_errors.mjs';

// Guardar la informacion de un asesor en el sistema
export const saveTeacherUser = async(teacherData) => {
    try{
        const { hora, fecha } = await getDateTime();

        if(!teacherData.nombre || !teacherData.correo || !teacherData.password){
            throw new AppError("Informacion incompleta", 401);
        }

        const teacher = new teacherModel({
            nombre : teacherData.nombre,
            correo : teacherData.correo,
            password : teacherData.password,
            tipoCuenta : 'Asesor',
            estatusCuenta : 'Activa',
            fechaRegistro : fecha,
            horaRegistro : hora,
            sesion : {
                ultimaSesion : '',
                codigoAcceso : '',
                validezCodigoAcceso : false,
            }
        });

        return await teacher.save();
    }catch(error){
        throw error;
    }
}

// Obtener la informacion de todos los asesores registrados en el sistema
export const allTeachersUsers = async(queryParams) => {
    try {
        const { search = '', page = 1, pageSize = 10 } = queryParams;
        const searchRegex = new RegExp(search, 'i');
        const filter = { 
            $or: [
                { nombre : searchRegex }, 
                { correo : searchRegex }
            ] 
        };

        const teachers = await teacherModel
            .find(filter)
            .select('-password')
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        const total = await teacherModel.countDocuments(filter);

        if(teachers.length === 0){
            throw new AppError('No hay asesores registrados en el sistema', 404);
        }

        return {
            teachers,
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

// Eliminar un asesor mediante id
export const deleteTeacherUser = async(id) => {
    try {
        const deleteTeacher = await teacherModel.findByIdAndDelete(id);

        if(!deleteTeacher){
            throw new AppError("Error al eliminar la cuenta", 401);
        }

        return;
    } catch (error) {
        throw error;
    }
}