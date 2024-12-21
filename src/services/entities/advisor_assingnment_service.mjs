import advisorAssignmentModel from '../../models/entities/advisor_assingnment_model.mjs';
import studentModel from '../../models/users/student_model.mjs';
import teacherModel from '../../models/users/teacher_model.mjs';
import { getDateTime } from '../../utils/datetime.mjs';
import AppError from '../../utils/errors/server_errors.mjs';

export const advisorAssignment = async(id_teacher, body) => {
    try {

        const { hora, fecha } = await getDateTime();

        const student = await studentModel.findById(body.alumno);
        if(!student){
            throw new AppError("Alumno no encontrado");
        }

        const newAdvisorAssignment = new advisorAssignmentModel({
            asesor : id_teacher,
            alumno : student._id,
            fechaAsignacion : fecha,
            periodo : body.periodo,
            notas : body.notas
        });

        await newAdvisorAssignment.save();

        return newAdvisorAssignment;
    } catch (error) {
        throw error;
    }
}

export const detailsAdvice = async(id_assignment) => {
    try {
        const assignment = await advisorAssignmentModel.findById(id_assignment);
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

export const deleteAdvisor = async(id_assignment) => {
    try {
        const assignment = await advisorAssignmentModel.findById(id_assignment);
        if(!assignment){
            throw new AppError("El asignamiento no existe");
        }

        await advisorAssignmentModel.findByIdAndDelete(id_assignment);

        return true;
    } catch (error) {
        throw error;
    }
}