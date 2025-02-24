import AppError from '../../utils/errors/server_errors.mjs';
import * as authService from '../../services/users/auth_service.mjs';
import * as userUtils from '../../utils/users/data_users.mjs';
import { handleServerError } from '../../utils/errors/error_handle.mjs';

import studentModel from '../../models/users/student_model.mjs';
import adminModel from '../../models/users/admin_model.mjs';
import teacherModel from '../../models/users/teacher_model.mjs';

// Inicio de sesion mediante correo
export const login = async(req, res) => {
    try {
        const { correo, password } = req.body;
        const { token } = await authService.loginUser(correo, password);

        // Configurar la cookie de sesión (opcional)
        res.cookie('session', token, {
            httpOnly: false, // Proteger la cookie del acceso por JavaScript
            signed: true,
        });

        return res.status(200).json({
            success: true,
            httpCode : 200,
            message: 'Sesión iniciada',
            token
        });
    } catch (error) {
        if (error instanceof AppError){
            return res.status(error.httpCode).json({
                success: false,
                httpCode: error.httpCode,
                message: error.message,
            });
        }
        handleServerError(res, error);
    }
}

// Verificar si el usuario ha iniciado sesion
export const userAuth = async(req, res) => {
    try {
        if(!req.signedCookies){
            return res.status(200).json({
                success : false,
                httpCode : 200,
                message : 'Usuario no autenticado'
            });
        }

        const user = await userUtils.getDataUserFromCookie(req);
        if(user.sesion.sesionIniciada === false){
            return res.status(200).json({
                success : false,
                httpCode : 200,
                message : 'Usuario no autenticado'
            });
        }

        return res.status(200).json({
            success : true,
            httpCode : 200,
            message : 'Usuario autenticado'
        });

        res.setHeader('Set-Cookie', 'session=; HttpOnly; Path=/; Max-Age=0');
    } catch (error) {
        if (error instanceof AppError){
            return res.status(error.httpCode).json({
                success: false,
                httpCode: error.httpCode,
                message: error.message,
            });
        }
        handleServerError(res, error);
    }
}

// Obtener la informacion de un usario
export const dataUser = async(req, res) => {
    try {
        const user = await userUtils.getDataUserFromCookie(req);
        if(!user){
            return res.status(404).json({
                success: false,
                httpCode: 404,
                message: 'El usuario no existe en el sistema',
            });
        }

        // Desestructurar user y remover la password
        const { password, ...userData } = user.toObject();

        return res.status(200).json({
            success: true,
            httpCode: 200,
            user : userData
        });
    } catch (error) {
        if (error instanceof AppError){
            return res.status(error.httpCode).json({
                success: false,
                httpCode: error.httpCode,
                message: error.message,
            });
        }
        handleServerError(res, error);
    }
}

// Obtener el tipo de cuenta de un usuario
export const userTypeAccount = async(req, res) => {
    try {
        const user = await userUtils.getDataUserFromCookie(req);
        if(!user){
            return res.status(404).json({
                success: false,
                httpCode: 404,
                message: 'El usuario no existe en el sistema',
            });
        }

        return res.status(200).json({
            success: true,
            httpCode: 200,
            accountType: user.tipoCuenta,
        });
    } catch (error) {
        if (error instanceof AppError){
            return res.status(error.httpCode).json({
                success: false,
                httpCode: error.httpCode,
                message: error.message,
            });
        }
        handleServerError(res, error);
    }
}

// Cambiar la password de un usuario
export const changePassword = async(req, res) => {
    try {
        const userInfo = await userUtils.getDataUserFromCookie(req);
        if(!req.body.password){
            return res.status(401).json({
                success: false,
                httpCode : 401,
                message: 'Contraseña requerida',
            });
        }
        const updateUserPassword = await authService.changeUserPassword(userInfo._id, req.body.password);

        return res.status(200).json({
            success: true,
            httpCode : 200,
            message: 'Contraseña actualizada',
        });
    } catch (error) {
        if (error instanceof AppError){
            return res.status(error.httpCode).json({
                success: false,
                httpCode: error.httpCode,
                message: error.message,
            });
        }
        handleServerError(res, error);
    }
}

// Cambiar la direccion de correo de un usuario
export const changeEmail = async(req, res) => {
    try {
        const userInfo = await userUtils.getDataUserFromCookie(req);
        if(!req.body.correo){
            return res.status(401).json({
                success: false,
                httpCode : 401,
                message: 'Direccion de correo requerido',
            });
        }
        const updateUserEmail = await authService.changeUserEmail(userInfo._id, req.body.correo);

        return res.status(200).json({
            success: true,
            httpCode : 200,
            message: 'Direccion de correo actualizada',
        });
    } catch (error) {
        if (error instanceof AppError){
            return res.status(error.httpCode).json({
                success: false,
                httpCode: error.httpCode,
                message: error.message,
            });
        }
        handleServerError(res, error);
    }
}

// Agregar campo sesionIniciada a los registros existentes.
export const updateUsers = async(req, res) => {
    try {
        await adminModel.updateMany(
            {}, 
            { $set : { 'sesion.sesionIniciada' : false } }
        );

        await teacherModel.updateMany(
            {},
            { $set : { 'sesion.sesionIniciada' : false } }
        );

        await studentModel.updateMany(
            {},
            { $set : { 'sesion.sesionIniciada' : false } }
        );

    } catch (error) {
        console.error(error);
    }
}

// Eliminiar mi cuenta
export const deleteMyAccount = async(req, res) => {
    try {
        const user = await userUtils.getDataUserFromCookie(req);
        if(!user){
            return res.status(404).json({
                success: false,
                httpCode: 404,
                message: 'El usuario no existe en el sistema',
            });
        }

        const deleteAccount = await authService.deleteMyAccount(user._id);
        
        return res.status(200).json({
            success: true,
            httpCode: 200,
            message: 'Cuenta eliminada',
        });
    } catch (error) {
        if (error instanceof AppError){
            return res.status(error.httpCode).json({
                success: false,
                httpCode: error.httpCode,
                message: error.message,
            });
        }
        handleServerError(res, error);
    }
}

// Cerrar sesion
export const logout = async(req, res) => {
    try {
        const user = await userUtils.getDataUserFromCookie(req);
        await authService.logOut(user);

        res.setHeader('Set-Cookie', 'session=; HttpOnly; Path=/; Max-Age=0');

        return res.status(200).json({
            success: false,
            httpCode : 200,
            message: 'Sesion cerrada',
        });
    } catch (error) {
        if (error instanceof AppError){
            return res.status(error.httpCode).json({
                success: false,
                httpCode: error.httpCode,
                message: error.message,
            });
        }
        handleServerError(res, error);
    }
};