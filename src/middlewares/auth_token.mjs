import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import adminModel from '../models/users/admin_model.mjs';
import teacherModel from '../models/users/teacher_model.mjs'; 
import studentModel from '../models/users/student_model.mjs';

export default function authToken(){
    const allowedUser = ['Coordinador'];

    return async function(req, res, next){
        const token = req.signedCookies.user;

        if(!token){
            return res.status(401).json({
                success : false,
                httpCode : 401,
                message : 'Token no proporcionado'
            });
        }

        try {
            const decoded = await jwt.verify(token, process.env.SECRET);
            if(!decoded || !allowedUser.includes(decoded.tipoCuenta)){
                return res.status(403).json({
                    success : false,
                    httpCode : 403,
                    message : 'Acceso no autorizado, no tienes permisos'
                });
            }

            // Aquí verificamos si la sesión está iniciada
            let user;
            if (decoded.account === 'Coordinador') {
                user = await adminModel.findById(decoded._id); // Obtener admin
            } else if (decoded.account === 'Asesor') {
                user = await teacherModel.findById(decoded._id); // Obtener asesor
            }
            else if (decoded.account === 'Alumno') {
                user = await studentModel.findById(decoded._id); // Obtener alumno
            }

            if (!user || user.sesion.sesionIniciada === false) {
                return res.status(401).json({
                    success: false,
                    message: 'Sesión no iniciada o no válida'
                });
            }

            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError'){
                return res.status(401).json({
                    success : false,
                    httpCode : 401,
                    expiretAt : error.expiretAt,
                    message : 'Token caducado, inicia sesion'
                });
            }else{
                return res.status(401).json({
                    success : false,
                    httpCode : 401,
                    message : 'Token invalido'
                });
            }
        }
        
    }
}