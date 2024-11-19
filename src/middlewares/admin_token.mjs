import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default function adminToken(){
    const allowedUser = ['Coordinador'];

    return async function(req, res, next){
        const token = req.signedCookies.user;

        if(!token){
            return res.status(401).json({
                success : false,
                statusCode : 401,
                message : 'Token no proporcionado'
            });
        }

        try {
            const decoded = await jwt.verify(token, process.env.SECRET);
            if(!decoded || !allowedUser.includes(decoded.tipoCuenta)){
                return res.status(403).json({
                    success : false,
                    statusCode : 403,
                    message : 'Acceso no autorizado, no tienes permisos'
                });
            }

            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError'){
                return res.status(401).json({
                    success : false,
                    statusCode : 401,
                    expiretAt : error.expiretAt,
                    message : 'Token caducado, inicia sesion'
                });
            }else{
                return res.status(401).json({
                    success : false,
                    statusCode : 401,
                    message : 'Token invalido'
                });
            }
        }
        
    }
}