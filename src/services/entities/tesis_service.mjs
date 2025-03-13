import { getDateTime } from '../../utils/datetime.mjs';
import tesisModel from '../../models/entities/tesis_model.mjs';
import advisorModel from '../../models/entities/advisor_model.mjs';
import studentModel from '../../models/users/student_model.mjs';
import teacherModel from '../../models/users/teacher_model.mjs';
import AppError from '../../utils/errors/server_errors.mjs';

// Registrar nueva tesis
export const registerTesis = async(tesisData, idStudent) => {
    try {
        const assignment = await advisorModel.findOne({ 'alumno.alumnoId' : idStudent });

        const tesisDuplicated = await tesisModel.findOne({ alumno : idStudent });
        if(tesisDuplicated){
            throw new AppError("El alumno ya cuenta con una tesis registrada", 400);
        }

        const { fecha } = await getDateTime();

        const newTesis = new tesisModel({
            titulo : tesisData.titulo,
            alumno : idStudent,
            asesor : assignment.asesor.asesorId,
            fechaInicio : fecha,
            periodo : tesisData.periodo,
            areaConocimiento : tesisData.areaConocimiento,
        });

        await newTesis.save();

        return newTesis;
    } catch (error) {
        throw error;
    }
}

// Obtener la tesis de un estudiante
export const getTesisByStudent = async(idStudent) => {
    try {
        const tesis = await tesisModel.findOne({ alumno : idStudent });
        if(!tesis){
            throw new AppError("No hay una tesis vinculada al alumno", 404);
        }

        return tesis;
    } catch (error) {
        throw error;
    }
}

// Obtener todas las tesis de un periodo
export const getAllTesis = async(period) => {
    try {
        // Obtener todas las tesis del periodo
        const tesis = await tesisModel.find({ periodo: period });

        // Obtener los IDs únicos de alumnos y asesores
        const idStudents = [...new Set(tesis.map(t => t.alumno._id.toString()))];
        const idTeachers = [...new Set(tesis.map(t => t.asesor._id.toString()))];

        // Consultar la información de los alumnos y asesores
        const students = await studentModel.find({ _id: { $in: idStudents } }, 'nombre');
        const teachers = await teacherModel.find({ _id: { $in: idTeachers } }, 'nombre');

        // Crear un diccionario para acceso rápido
        const studentMap = students.reduce((acc, student) => {
            acc[student._id.toString()] = student.nombre;
            return acc;
        }, {});

        const teacherMap = teachers.reduce((acc, teacher) => {
            acc[teacher._id.toString()] = teacher.nombre;
            return acc;
        }, {});

        // Agregar la información de nombres a la data de tesis
        const tesisData = tesis.map(t => ({
            ...t.toObject(),  // Convertir el documento de Mongoose a objeto JSON
            nombreAlumno: studentMap[t.alumno._id.toString()] || 'Desconocido',
            nombreAsesor: teacherMap[t.asesor._id.toString()] || 'Desconocido'
        }));
        
        return tesisData;
    } catch (error) {
        throw error;
    }
}

// Actualizar datos de una tesis
export const updateTesis = async(idTesis, tesisData) => {
    try {
        // Validar si la tesis existe
        const tesis = await tesisModel.findById(idTesis);
        if(!tesis){
            throw new AppError("Tesis no encontrada", 404);
        }

        const updateFields = {};

        // Validar campos a actualizar
        if(tesisData.titulo){ updateFields.titulo = tesisData.titulo }
        if(tesisData.url){ updateFields.url = tesisData.url }
        if(tesisData.areaConocimiento){ updateFields.areaConocimiento = tesisData.areaConocimiento }
        if(tesisData.resumen){ updateFields.resumen = tesisData.resumen }
        if(tesisData.periodo){ updateFields.periodo = tesisData.periodo }

        const updateTesisInfo = await tesisModel.findByIdAndUpdate(idTesis, updateFields, { new : true });

        return updateTesisInfo;
    } catch (error) {
        throw error;
    }
}