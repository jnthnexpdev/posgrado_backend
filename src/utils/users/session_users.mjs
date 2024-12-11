import dotenv from 'dotenv';
dotenv.config();

import adminModel from '../../models/users/admin_model.mjs';
import teacherModel from '../../models/users/teacher_model.mjs';
import studentModel from '../../models/users/student_model.mjs';
import AppError from '../../utils/errors/server_errors.mjs';
import { getDateTime } from '../../utils/datetime';

export async function updateLastSession(email, account){
    try{
        const { fecha, hora } = await getDateTime();
        const dateTime = `${hora}, ${fecha}`;

        if(account === 'Coordinador'){
            await adminModel.findOneAndUpdate(
                { correo : email },
                { 'sesion.ultimaSesion' : dateTime },
                { new : true }
            );
        }else if(account === 'Asesor'){
            await teacherModel.findOneAndUpdate(
                { correo : email },
                { 'sesion.ultimaSesion' : dateTime },
                { new : true }
            );
        }else if(account === 'Alumno'){
            await studentModel.findOneAndUpdate(
                { correo : email },
                { 'sesion.ultimaSesion' : dateTime },
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
        if(user.cuenta === 'Coordinador'){
            await adminModel.findOneAndUpdate(
                { correo : user.correo },
                { 'sesion.codigoAcceso' : code, 'sesion.validezCodigoAcceso' : true },
                { new : true }
            );
        }else if(user.cuenta === 'Asesor'){
            await teacherModel.findOneAndUpdate(
                { correo : user.correo },
                { 'sesion.codigoAcceso' : code, 'sesion.validezCodigoAcceso' : true },
                { new : true }
            );
        }else if(user.cuenta === 'Alumno'){
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

        if(user.cuenta === 'Coordinador'){
            await adminModel.findOneAndUpdate(
                { correo : user.correo },
                { 'sesion.codigoAcceso' : null, 'sesion.validezCodigoAcceso' : false },
                { new : true }
            );
        }else if(user.cuenta === 'Asesor'){
            await teacherModel.findOneAndUpdate(
                { correo : user.correo },
                { 'sesion.codigoAcceso' : null, 'sesion.validezCodigoAcceso' : false  },
                { new : true }
            );
        }else if(user.cuenta === 'Alumno'){
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