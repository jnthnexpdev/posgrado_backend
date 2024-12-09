import adminModel from '../../models/users/admin_model.mjs';
import { getDateTime } from '../../utils/datetime.mjs';
import AppError from '../../utils/errors/server_errors.mjs';

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