import adminModel from '../../models/users/admin_model.mjs';
import { getDateTime } from '../../utils/datetime.mjs';
import AppError from '../../utils/errors/server_errors.mjs';

// Guardar nuevo administrador 
export const saveAdminUser = async(adminData) => {
    try{
        const { hora, fecha } = await getDateTime();

        if(!adminData.nombre || !adminData.correo || !adminData.password){
            throw new AppError("Informacion incompleta", 401);
        }

        const admin = new adminModel({
            nombre : adminData.nombre,
            correo : adminData.correo,
            password : adminData.password,
            tipoCuenta : 'Coordinador',
            estatusCuenta : 'Activa',
            fechaRegistro : fecha,
            horaRegistro : hora,
            sesion : {
                ultimaSesion : '',
                codigoAcceso : '',
                validezCodigoAcceso : false,
            }
        });

        return await admin.save();
    }catch(error){
        throw error;
    }
}

// Obtener la informacion de todos los administradores en el sistema
export const allAdminsUsers = async(queryParams) => {
    try {
        const { search = '', page = 1, pageSize = 10 } = queryParams;
        const searchRegex = new RegExp(search, 'i');
        const filter = { 
            $or: [
                { nombre : searchRegex }, 
                { correo : searchRegex }
            ] 
        };

        const admins = await adminModel
            .find(filter)
            .select('-password')
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        const total = await adminModel.countDocuments(filter);

        if(admins.length === 0){
            throw new AppError('No hay coordinadores registrados en el sistema', 404);
        }

        return {
            admins,
            pagination: {
                total,
                page: Number(page),
                pageSize: Number(pageSize),
                totalPages: Math.ceil(total / pageSize)
            }
        };

    } catch (error) {
        throw error;
    }
}

// Eliminar un administrador mediante id
export const deleteAdminUser = async(id) => {
    try {
        const deleteAdmin = await adminModel.findByIdAndDelete(id);

        if(!deleteAdmin){
            throw new AppError("Error al eliminar la cuenta", 401);
        }

        return;
    } catch (error) {
        throw error;
    }
}