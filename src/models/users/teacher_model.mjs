import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
const schema = mongoose.Schema;

const teacherModel = new schema({
    nombre : { type : String, required : true, trim: true },
    correo : { type : String, required : true, trim: true, unique : true },
    password : { type : String, required : true },
    tipoCuenta: { 
        type: String, 
        required: true, 
        enum: ['Coordinador', 'Asesor', 'Alumno'] 
    },
    estatusCuenta: { 
        type: String, 
        required: true, 
        enum: ['Activa', 'Suspendida', 'Bloqueada'] 
    },
    fechaRegistro: { type: String },
    horaRegistro: { type: String },
    sesion: {
        sesionIniciada : { type : Boolean, default : false },
        ultimaSesion: { type: String },
        codigoAcceso: { type: String },
        validezCodigo: { type: Boolean } 
    }
});

teacherModel.pre('save', async function(next){
    try{
        const salt = 13;
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
        next();
    }catch(error){
        next(error);
    }
});

const teacher = mongoose.model('Asesores', teacherModel);
export default teacher;