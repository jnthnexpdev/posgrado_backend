import mongoose from "mongoose";
const schema = mongoose.Schema;

const tesisModel = new schema({
    titulo : { type : String, required : true },
    alumno : { type : mongoose.Schema.Types.ObjectId, ref : 'Alumnos', required : true },
    asesor : { type : mongoose.Schema.Types.ObjectId, ref : 'Asesores', required : true },
    estatus : { type : String, enum : ['En progreso', 'Aprobada', 'Rechazada'] },
    aprobacion : {
        nombre : { type : String, required : true },
        fechaAprobacion : { type : String, required : true }
    },
    url : { type : String },
    fechaInicio : { type : String, required : true },
    fechaEntrega : { type : String, required : true },
    areaConocimiento : { type : String },
    resumen : { type : String },
});

const tesis = mongoose.model('Tesis', tesisModel);

export default tesis;