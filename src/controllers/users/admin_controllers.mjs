import * as adminService from '../../services/users/admin_service.mjs';
import { handleServerError } from '../../utils/errors/error_handle.mjs';
import AppError from '../../utils/errors/server_errors.mjs';

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