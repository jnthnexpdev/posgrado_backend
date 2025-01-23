import advisorAssignmentModel from '../../models/entities/advisor_assingnment_model.mjs';
import studentModel from '../../models/users/student_model.mjs';
import teacherModel from '../../models/users/teacher_model.mjs';
import { getDateTime } from '../../utils/datetime.mjs';
import AppError from '../../utils/errors/server_errors.mjs';

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

export const studentsAdvised = async(idTeacher, queryParams) => {
    try {
        let { search = '', page = 1, pageSize = 10 } = queryParams;

        if(search != ''){ 
            page = 1 
        }
        
        const adviseds = await advisorAssignmentModel
        .find({ 'asesor.asesorId': idTeacher }) 
        .populate('alumno', 'nombre correo numeroControl')
        .lean();

        if (!adviseds.length) {
            throw new AppError('No se encontraron alumnos asesorados para este asesor.', 404);
        }

        const advisedsWithDefaults = adviseds.map(advised => {
            // Si el alumno no existe, asigna valores por defecto
            if (!advised.alumno) {
                advised.alumno = {
                    nombre: 'Alumno eliminado',
                    correo: 'N/A',
                    numeroControl : 'N/A'
                };
            }
            return advised;
        });

        const filteredAdviseds = advisedsWithDefaults.filter(advised => {
            const searchRegex = new RegExp(search, 'i');
            return (
                searchRegex.test(advised.alumno.nombre) ||
                searchRegex.test(advised.alumno.correo)
            );
        });

        const totalStudents = filteredAdviseds.length;
        const totalPages = Math.ceil(totalStudents / pageSize);
        const paginatedAdviseds = filteredAdviseds.slice((page - 1) * pageSize, page * pageSize );
        const pagination = {
            "total": Number(totalStudents),
            "page": Number(page),
            "pageSize": Number(pageSize),
            "totalPages": Number(totalPages)
        }

        return {
            students: paginatedAdviseds,
            pagination
        };
    } catch (error) {
        throw error;
    }
}

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