import dotenv from 'dotenv';
dotenv.config();

import adminModel from '../../models/users/admin_model.mjs';
import teacherModel from '../../models/users/teacher_model.mjs';
import studentModel from '../../models/users/student_model.mjs';
import AppError from '../../utils/errors/server_errors.mjs';

export async function getDataUserFromCookie(req){
    const cookie = req.signedCookies.session;
    if(!cookie){
        throw new AppError("Cookie no encontrada", 400);
    }

    try {
        const decoded = jwt.verify(cookie, process.env.SECRET);
        const admin = await adminModel.findById(decoded._id).select('-password');
        const teacher = await teacherModel.findById(decoded._id).select('-password');
        const student = await studentModel.findById(decoded._id).select('-password');

        if(!admin || !teacher || !student){
            throw new AppError("Usuario no encontrado", 404);  
        }

        return admin || teacher || student;
    } catch (error) {
        throw new AppError("Ha ocurrido un error al obtener la informacion", 400);
    }
}

export async function getDataUserByEmail(email){
    try {
        const admin = await adminModel.findOne({ correo : email });
        const teacher = await teacherModel.findOne({ correo : email });
        const student = await studentModel.findOne({ correo : email });

        if(!admin && !teacher && !student){
            throw new AppError("El correo no pertenece a ningun usuario registrado", 404);  
        }
        return admin || teacher || student;
    } catch (error) {
        throw new AppError("Ha ocurrido un error al obtener la informacion", 400);
    }
}

export async function getDataUserById(id){
    try {
        const admin = await adminModel.findById(id).select('-password');
        const teacher = await teacherModel.findById(id).select('-password');
        const student = await studentModel.findById(id).select('-password');

        if(!admin || !teacher || !student){
            throw new AppError("El id no pertenece a ningun usuario registrado", 404);  
        }

        return admin || teacher || student;
    } catch (error) {
        throw new AppError("Ha ocurrido un error al obtener la informacion", 400);
    }
}