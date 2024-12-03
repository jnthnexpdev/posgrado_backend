import * as adminService from '../../services/users/admin_service.mjs';
import { handleServerError } from '../../utils/error_handle.mjs';

export const registerAdminAccount = async(req, res) => {
    try {
        const adminData = req.body;
        const newAdmin = await adminService.saveAdminUser(adminData);

        return res.status(201).json({
            success : true,
            statusCode : 201,
            message : 'Coordinador guardado',
            adminAccount : newAdmin
        });

    } catch (error) {
        handleServerError(res, error);
    }
}