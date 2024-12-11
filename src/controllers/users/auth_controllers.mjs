import mongoose from 'mongoose';

import AppError from '../../utils/errors/server_errors.mjs';
import * as authService from '../../services/users/auth_service.mjs';
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

        // Responder con éxito
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