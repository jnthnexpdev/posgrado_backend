import bcrypt from bcrypt;
import mongoose from mongoose;
const schema = mongoose.Schema;

const teacherModel = new schema({
    nombre : { type : String, required : true },
    correo : { type : String, required : true },
    password : { type : String, required : true },
    tipoCuenta : { type : String, required : true },
    fechaRegistro: { type: String },
    horaRegistro: { type: String },
    sesion: {
        ultimaSesion: { type: String },
        codigoAcceso: { type: String },
        validezCodigoAcceso: { type: Boolean } 
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