import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import AppError from '../../utils/errors/server_errors.mjs';
import * as userUtils from '../../utils/users/data_users.mjs';
import * as sesionUtils from '../../utils/users/session_users.mjs';
import adminModel from '../../models/users/admin_model.mjs';
import teacherModel from '../../models/users/teacher_model.mjs';
import studentModel from '../../models/users/student_model.mjs';

export const loginUser = async(correo, password) => {
    try {   
        if (!correo || !password) {
            throw new AppError('Correo y contraseña son obligatorios', 400);
        }

        const user = await userUtils.getDataUserByEmail(correo);
        if (!user) {
            throw new AppError('Usuario no encontrado', 404);
        }
        
        // Validar la contraseña
        const isPasswordValid = await bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            throw new AppError('Correo y/o contraseña incorrectos', 401);
        }

        // Actualizar la última sesión
        await sesionUtils.updateLastSession(user.correo, user.tipoCuenta);

        // Generar el token
        const token = await sesionUtils.createToken(user);

        // Retornar los datos relevantes
        return token;

    } catch (error) {
        throw error;
    }
}

export const changeUserPassword = async(id, password) => {
    try {
        const isValidId = mongoose.isValidObjectId(id);
        if(!isValidId){
            throw new AppError('Id invalido', 401);
        }

        const user = await userUtils.getDataUserById(id);
        if(!user){
            throw new AppError('El usuario no existe', 404);
        }

        user.password = password;
        user.save();

        return true;
    } catch (error) {
        throw error;
    }
}

export const changeUserEmail = async(id, email) => {
    try {
        const isValidId = mongoose.isValidObjectId(id);
        if(!isValidId){
            throw new AppError('Id invalido', 401);
        }

        const user = await userUtils.getDataUserById(id);
        if(!user){
            throw new AppError('El usuario no existe', 404);
        }

        const emailInUse = await userUtils.getDataUserByEmail(email);
        if(emailInUse){
            throw new AppError('El correo ya esta registrado, intenta con otro', 401);
        }

        switch(user.tipoCuenta){
            case 'Coordinador': 
                await adminModel.findByIdAndUpdate(id, { correo : email }, { new : true });
            break;

            case 'Asesor': 
                await teacherModel.findByIdAndUpdate(id, { correo : email }, { new : true });
            break;

            case 'Alumno': 
                await studentModel.findByIdAndUpdate(id, { correo : email }, { new : true });
            break;

            default : 
                throw new AppError('Tipo de usuario desconocido', 401);
        }

        return true;
    } catch (error) {
        throw error;
    }
}