import * as adminService from '../../services/users/admin_service.mjs';
import { handleServerError } from '../../utils/errors/error_handle.mjs';
import AppError from '../../utils/errors/server_errors.mjs';
import mongoose from 'mongoose';

export const registerAdminAccount = async(req, res) => {
    try {
        const adminData = req.body;
        const newAdmin = await adminService.saveAdminUser(adminData);

        return res.status(201).json({
            success : true,
            httpCode : 201,
            message : 'Coordinador guardado',
            adminAccount : newAdmin
        });

    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.httpCode).json({
                success: false,
                httpCode: error.httpCode,
                message: error.message,
            });
        }
        handleServerError(res, error);
    }
}

export const allAdminsAccounts = async(req, res) => {
    try {
        const adminsInfo = await adminService.allAdminsUsers(req.query);

        return res.status(200).json({
            success: true,
            message: 'Coordinadores obtenidos correctamente',
            admins: adminsInfo.admins,
            pagination: adminsInfo.pagination
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

export const deleteAdminAccount = async(req, res) => {
    try {

        const id = req.params.id;
        const isIdValid = mongoose.isValidObjectId(id);
        if(!isIdValid){
            return res.status(404).json({
                success : false,
                httpCode : 404,
                message : 'El id es invalido',
            });
        }

        await adminService.deleteAdminUser(id);

        return res.status(201).json({
            success : true,
            httpCode : 201,
            message : 'Cuenta eliminada',
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