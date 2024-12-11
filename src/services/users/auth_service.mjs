import bcrypt from 'bcrypt';

import AppError from '../../utils/errors/server_errors.mjs';
import * as userUtils from '../../utils/users/data_users.mjs';
import * as sesionUtils from '../../utils/users/session_users.mjs';

export const loginUser = async(correo, password) => {
    try {   
        if (!correo || !password) {
            throw new AppError('Correo y contraseña son obligatorios', 400);
        }

        const user = await userUtils.getDataUserByEmail(correo);
        if (!user) {
            throw new AppError('Usuario no encontrado', 404);
        }
        
        // Validar la contraseña
        const isPasswordValid = await bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            throw new AppError('Correo y/o contraseña incorrectos', 401);
        }

        // Actualizar la última sesión
        await sesionUtils.updateLastSession(user.correo, user.tipoCuenta);

        // Generar el token
        const token = await sesionUtils.createToken(user);

        // Retornar los datos relevantes
        return token;

    } catch (error) {
        throw error;
    }
}