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

export const logout = async(req, res) => {
    try {
        const removeToken = await authService.logOut(req, res);
        if(!removeToken){
            return res.status(401).json({
                success: false,
                httpCode : 401,
                message: 'Ha ocurrido un error al cerrar la sesion',
            });
        }

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