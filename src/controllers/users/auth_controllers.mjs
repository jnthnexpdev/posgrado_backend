import mongoose from 'mongoose';

import AppError from '../../utils/errors/server_errors.mjs';
import * as authService from '../../services/users/auth_service.mjs';
import * as userUtils from '../../utils/users/data_users.mjs';
import { handleServerError } from '../../utils/errors/error_handle.mjs';


export const login = async(req, res) => {
    try {
        const { correo, password } = req.body;
        const { token } = await authService.loginUser(correo, password);

        // Configurar la cookie de sesión (opcional)
        res.cookie('session', token, {
            httpOnly: false, // Proteger la cookie del acceso por JavaScript
            signed: true, // Asegurarse de que la cookie esté firmada
        });

        return res.status(200).json({
            success: true,
            httpCode : 200,
            message: 'Sesión iniciada correctamente',
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

        return res.status(201).json({
            success: true,
            httpCode : 201,
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

        return res.status(201).json({
            success: true,
            httpCode : 201,
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