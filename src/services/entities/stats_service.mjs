import periodModel from '../../models/entities/period_model.mjs';
import tesisModel from '../../models/entities/tesis_model.mjs';
import studentsModel from '../../models/users/student_model.mjs';
import teachersModel from '../../models/users/teacher_model.mjs';

// Generar estadisticas del serividor, alumnos, asesores, periodos, tesis, etc.
export const statsSystem = async() => {
    try {
        const studentCount = await studentsModel.countDocuments();
        const teacherCount = await teachersModel.countDocuments();
        const periodCount = await periodModel.countDocuments();
        const tesisCount = await tesisModel.countDocuments();

        const stats = {
            studentCount,
            teacherCount,
            periodCount,
            tesisCount
        };

        return stats;
    } catch (error) {
        throw error;
    }
}