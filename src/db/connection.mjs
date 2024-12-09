import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Conexion establecida con MongoDB');
    } catch (error) {
        console.error('Error al conectar con MongoDB', error);
    }
}