import advisorAssignmentModel from '../../models/entities/advisor_assingnment_model.mjs';
import studentModel from '../../models/users/student_model.mjs';
import teacherModel from '../../models/users/teacher_model.mjs';
import { getDateTime } from '../../utils/datetime.mjs';
import * as userUtils from '../../utils/users/data_users.mjs';
import AppError from '../../utils/errors/server_errors.mjs';
import teacher from '../../models/users/teacher_model.mjs';

// Guardar nuevo asesoramiento
export const advisorAssignment = async(idTeacher, controlNumber, body) => {
    try {
        const { hora, fecha } = await getDateTime();

        const studentAdvised = await advisorAssignmentModel.findOne({ 'alumno.numeroControl' : controlNumber });
        if(studentAdvised){
            throw new AppError("El alumno ya cuenta con un/a asesor/a asignado/a", 400);
        }

        const student = await studentModel.findOne(
            { numeroControl :  controlNumber }
        );
        if(!student){
            throw new AppError("Alumno no encontrado", 404);
        }

        const teacher = await teacherModel.findById(idTeacher);
        if(!teacher){
            throw new AppError("Asesor no encontrado", 404);
        }

        const newAdvisorAssignment = new advisorAssignmentModel({
            asesor : {
                asesorId : teacher._id,
                nombre : teacher.nombre
            },
            alumno : {
                alumnoId : student._id,
                nombre : student.nombre,
                correo : student.correo,
                numeroControl : student.numeroControl,
            },
            fechaAsignacion : fecha,
            periodo : body.periodo,
            notas : body.notas || ''
        });

        await newAdvisorAssignment.save();

        return newAdvisorAssignment;
    } catch (error) {
        throw error;
    }
}

// Informacion alumnos asesorados
export const studentsAdvised = async (idTeacher, period, queryParams) => {
    try {
        let { search = '', page = 1, pageSize = 10 } = queryParams;

        if (search !== '') { 
            page = 1;
        }

        // Construimos el filtro base (siempre busca por el ID del asesor)
        let filter = { 'asesor.asesorId': idTeacher };

        // Agregamos el filtro de periodo si se proporciona
        if (period) {
            filter.periodo = period;
        }

        const adviseds = await advisorAssignmentModel
            .find(filter)
            .populate('alumno', 'nombre correo numeroControl')
            .lean();

        if (!adviseds.length) {
            throw new AppError('No se encontraron alumnos asesorados para este asesor.', 404);
        }

        const advisedsWithDefaults = adviseds.map(advised => {
            if (!advised.alumno) {
                advised.alumno = {
                    nombre: 'Alumno eliminado',
                    correo: 'N/A',
                    numeroControl: 'N/A'
                };
            }
            return advised;
        });

        // Aplicamos el filtro de búsqueda
        const searchRegex = new RegExp(search, 'i');
        const filteredAdviseds = advisedsWithDefaults.filter(advised =>
            searchRegex.test(advised.alumno.nombre) || searchRegex.test(advised.alumno.correo)
        );

        // Paginación
        const totalStudents = filteredAdviseds.length;
        const totalPages = Math.ceil(totalStudents / pageSize);
        const paginatedAdviseds = filteredAdviseds.slice((page - 1) * pageSize, page * pageSize);
        
        return {
            students: paginatedAdviseds,
            pagination: {
                total: totalStudents,
                page: Number(page),
                pageSize: Number(pageSize),
                totalPages: Number(totalPages)
            }
        };
    } catch (error) {
        throw error;
    }
};

// Obtener los datos del asesor de un alumno
export const searchTeacher = async(idStudent) => {
    try {
        const assignment = await advisorAssignmentModel.findOne({ 'alumno.alumnoId' : idStudent });
        const teacher = await userUtils.getDataUserById(assignment.asesor.asesorId);
        if(!teacher){
            throw new AppError("Asesor no encontrado", 404);
        }
        const assingmentData = {
            nombre : teacher.nombre,
            correo : teacher.correo,
            fechaAsignacion : assignment.fechaAsignacion
        }
        return assingmentData;
    } catch (error) {
        throw error;
    }
}

// Buscar informacion del asesoramiento
export const detailsAdvice = async(idAssignment) => {
    try {
        const assignment = await advisorAssignmentModel.findById(idAssignment);
        if(!assignment){
            throw new AppError("El asesoramiento no existe", 404);
        }

        const student = await studentModel.findById(assignment.alumno).select('-password');
        if(!student){
            throw new AppError("El alumno no existe", 404);
        }

        const teacher = await teacherModel.findById(assignment.asesor).select('-password');
        if(!teacher){
            throw new AppError("El/la asesor/a no existe", 404);
        }

        return { assignment, student, teacher };
    } catch (error) {
        throw error;
    }
}

// Eliminar asesoramiento por id
export const deleteAdvisor = async(idAssignment) => {
    try {
        const assignment = await advisorAssignmentModel.findById(idAssignment);
        if(!assignment){
            throw new AppError("El asignamiento no existe");
        }

        await advisorAssignmentModel.findByIdAndDelete(idAssignment);

        return true;
    } catch (error) {
        throw error;
    }
}