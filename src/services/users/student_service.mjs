import studentModel from '../../models/users/student_model.mjs';
import { getDateTime } from '../../utils/datetime.mjs';
import { deletePublicationOfStudent } from '../entities/publication_service.mjs';
import { deleteTesisByStudent } from '../entities/tesis_service.mjs';
import AppError from '../../utils/errors/server_errors.mjs';

// Guardar la informacion de un alumno
export const saveStudentUser = async(studentData) => {
    try{
        const { hora, fecha } = await getDateTime();

        if(!studentData.nombre || !studentData.numeroControl || !studentData.correo || !studentData.password){
            throw new AppError("Informacion incompleta", 401);
        }

        const student = new studentModel({
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

// Obtener la informacion de todos los alumnos
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

        const students = await studentModel
            .find(filter)
            .select('-password')
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        const total = await studentModel.countDocuments(filter);

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

// Eliminar un alumno mediante id
export const deleteStudentUser = async(id) => {
    try {

        // Eliminar la publacion del alumno
        await deletePublicationOfStudent(id);

        // Eliminar la tesis del alumno
        await deleteTesisByStudent(id);

        // Eliminar la informacion del alumno
        const deleteStudent = await studentModel.findByIdAndDelete(id);

        if(!deleteStudent){
            throw new AppError("Error al eliminar la cuenta", 401);
        }

        return true;
    } catch (error) {
        throw error;
    }
}