import studentModel from '../../models/users/student_model.mjs';
import advisorModel from '../../models/entities/advisor_model.mjs'
import assingmentModel from '../../models/entities/assignment_model.mjs';
import { getDateTime } from '../../utils/datetime.mjs';
import * as userUtils from '../../utils/users/data_users.mjs';
import AppError from '../../utils/errors/server_errors.mjs';

// Guardar nueva asignacion y agregar a todos los alumnos
// asesorados para que puedan agregar su tarea
export const newAssignment = async(data, teacher) => {
    try {
        const { fecha } = await getDateTime();

        const students = await advisorModel.find({
            'asesor.asesorId' : teacher._id,
            periodo : data.periodo
        });

        const assignment = new assingmentModel({
            nombre : data.nombre,
            descripcion : data.descripcion,
            fechaAsignacion : fecha,
            fechaLimite : data.fechaLimite,
            periodo : data.periodo,
            asesor : {
                idAsesor : teacher._id,
                nombreAsesor : teacher.nombre
            },
            alumnos: students.map(student => ({
                idAlumno: student.alumno.alumnoId,
                nombreAlumno: student.alumno.nombre
            }))
        });

        await assignment.save();

        return assignment;
    } catch (error) {
        throw new error;
    }
}

// Obtener todas las asignaciones de un asesor filtradas por periodo
export const assignmentByTeacherAndPeriod = async(idTeacher, period, queryParams) => {
    try {
        let { page = 1, pageSize = 20 } = queryParams;

        const assignments = await assingmentModel
            .find({ 'asesor.idAsesor' : idTeacher, periodo : period })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        const total = await assingmentModel.countDocuments({ 'asesor.idAsesor' : idTeacher, periodo : period });

        if(total === 0){
            throw new AppError("No hay asignaciones en este periodo", 404);
        }

        return {
            assignments,
            pagination : {
                total,
                page: Number(page),
                pageSize: Number(pageSize),
                totalPages: Math.ceil(total / pageSize)
            }
        };
    } catch (error) {
        throw new error;
    }
}

export const updateAssignmentData = async(idAssignment, data) => {
    try {
        // Validar si la tesis existe
        const assignment = await assingmentModel.findById(idAssignment);
        if(!assignment){
            throw new AppError("Asignacion no encontrada", 404);
        }

        const updateFields = {};

        // Validar campos a actualizar
        if(assignment.nombre){ updateFields.nombre = data.nombre }
        if(assignment.descripcion){ updateFields.descripcion = data.descripcion }
        if(assignment.periodo){ updateFields.periodo = data.periodo }
        if(assignment.fechaLimite){ updateFields.fechaLimite = data.fechaLimite }

        const updateAssignmentInfo = await assingmentModel.findByIdAndUpdate(idAssignment, updateFields, { new : true });

        return updateAssignmentInfo;
    } catch (error) {
        throw new error;
    }
}

// Eliminar asignacion de un asesor mediante id
export const deleteAssingmentById = async(idAssingment) => {
    try {
        const assignment = await assingmentModel.findById(idAssingment);
        if(!assignment){
            throw new AppError("La asignacion no existe", 404);
        }

        await assingmentModel.findByIdAndDelete(idAssingment);

        return true;
    } catch (error) {
        throw new error;
    }
}