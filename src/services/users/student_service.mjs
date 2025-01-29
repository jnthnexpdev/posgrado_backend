import studenModel from '../../models/users/student_model.mjs';
import { getDateTime } from '../../utils/datetime.mjs';
import AppError from '../../utils/errors/server_errors.mjs';

export const saveStudentUser = async(studentData) => {
    try{
        const { hora, fecha } = await getDateTime();

        if(!studentData.nombre || !studentData.numeroControl || !studentData.correo || !studentData.password){
            throw new AppError("Informacion incompleta", 401);
        }

        const student = new studenModel({
            nombre : studentData.nombre,
            correo : studentData.correo,
            numeroControl : studentData.numeroControl,
            password : studentData.password,
            tipoCuenta : 'Alumno',
            estatusCuenta : 'Activa',
            fechaRegistro : fecha,
            horaRegistro : hora,
            sesion : {
                ultimaSesion : '',
                codigoAcceso : '',
                validezCodigoAcceso : false,
            }
        });
        await student.save();
        return student;
    }catch(error){
        throw error;
    }
}

export const allStudentsUsers = async(queryParams) => {
    try {
        const { search = '', page = 1, pageSize = 10 } = queryParams;
        const searchRegex = new RegExp(search, 'i');
        const filter = { 
            $or: [
                { nombre : searchRegex }, 
                { correo : searchRegex }
            ] 
        };

        const students = await studenModel
            .find(filter)
            .select('-password')
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        const total = await studenModel.countDocuments(filter);

        if(students.length === 0){
            throw new AppError('No hay alumnos registrados en el sistema', 404);
        }

        return {
            students,
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

export const deleteStudentsUser = async(id) => {
    try {
        const deleteStudent = await studenModel.findByIdAndDelete(id);

        if(!deleteStudent){
            throw new AppError("Error al eliminar la cuenta", 401);
        }

        return;
    } catch (error) {
        throw error;
    }
}