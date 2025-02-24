import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import adminModel from '../../models/users/admin_model.mjs';
import teacherModel from '../../models/users/teacher_model.mjs';
import studentModel from '../../models/users/student_model.mjs';
import AppError from '../../utils/errors/server_errors.mjs';
import { getDateTime } from '../../utils/datetime.mjs';

export async function createToken(user) {
    try {
        const { fecha, hora } = await getDateTime();

        const tokenData = {
            _id : user._id,
            account : user.tipoCuenta,
            name : user.nombre,
            time : hora,
            date : fecha
        };
    
        const token = jwt.sign(
            tokenData,
            process.env.SECRET,
            { expiresIn : '8h', algorithm : 'HS256' }
        );
    
        return { token }; 
    } catch (error) {
        throw new AppError('Ha ocurrido un error al crear el token de sesion', 401);
    }
}

export async function updateLastSession(email, account){
    try{
        const { fecha, hora } = await getDateTime();
        const dateTime = `${hora}, ${fecha}`;

        if(account === 'Coordinador'){
            await adminModel.findOneAndUpdate(
                { correo : email },
                { 'sesion.ultimaSesion' : dateTime, 'sesion.sesionIniciada' : true },
                { new : true }
            );
        }else if(account === 'Asesor'){
            await teacherModel.findOneAndUpdate(
                { correo : email},
                { 'sesion.ultimaSesion' : dateTime, 'sesion.sesionIniciada' : true },
                { new : true }
            );
        }else if(account === 'Alumno'){
            await studentModel.findOneAndUpdate(
                { correo : email, },
                { 'sesion.ultimaSesion' : dateTime, 'sesion.sesionIniciada' : true },
                { new : true }
            );
        }

        return true;
    }catch (error) {
        throw new AppError('Ha ocurrido un error al actualizar la informacion de la ultima sesion del usuario', 401);
    }
}

export async function updateSessionCode(user, code){
    try {
        if(user.tipoCuenta === 'Coordinador'){
            await adminModel.findOneAndUpdate(
                { correo : user.correo },
                { 'sesion.codigoAcceso' : code, 'sesion.validezCodigoAcceso' : true },
                { new : true }
            );
        }else if(user.tipoCuenta === 'Asesor'){
            await teacherModel.findOneAndUpdate(
                { correo : user.correo },
                { 'sesion.codigoAcceso' : code, 'sesion.validezCodigoAcceso' : true },
                { new : true }
            );
        }else if(user.tipoCuenta === 'Alumno'){
            await studentModel.findOneAndUpdate(
                { correo : user.correo },
                { 'sesion.codigoAcceso' : code, 'sesion.validezCodigoAcceso' : true },
                { new : true }
            );
        }

        return true;
    } catch (error) {
        throw new AppError('Ha ocurrido un error al actualizar la informacion de la ultima sesion del usuario', 401);
    }
}

export async function updateSessionCodeValidity (user){
    try{

        if(user.tipoCuenta === 'Coordinador'){
            await adminModel.findOneAndUpdate(
                { correo : user.correo },
                { 'sesion.codigoAcceso' : null, 'sesion.validezCodigoAcceso' : false },
                { new : true }
            );
        }else if(user.tipoCuenta === 'Asesor'){
            await teacherModel.findOneAndUpdate(
                { correo : user.correo },
                { 'sesion.codigoAcceso' : null, 'sesion.validezCodigoAcceso' : false  },
                { new : true }
            );
        }else if(user.tipoCuenta === 'Alumno'){
            await studentModel.findOneAndUpdate(
                { correo : user.correo },
                { 'sesion.codigoAcceso' : null, 'sesion.validezCodigoAcceso' : false  },
                { new : true }
            );
        }

        return true;
    }catch(error){
        throw new AppError('Ha ocurrido un error al actualizar la informacion de la ultima sesion del usuario', 401);
    }
}