import mongoose from "mongoose";
const schema = mongoose.Schema;

const tesisModel = new schema({
    titulo : { type : String, required : true },
    alumno : { type : mongoose.Schema.Types.ObjectId, ref : 'Alumnos', required : true },
    asesor : { type : mongoose.Schema.Types.ObjectId, ref : 'Asesores', required : true },
    periodo : { type : String, required : true },
    estatus : { type : String, enum : ['En progreso', 'Aprobada', 'Rechazada'], default : 'En progreso' },
    aprobacion : {
        nombre : { type : String, default : null  },
        fechaAprobacion : { type : String, default : null  }
    },
    url : { type : String, default : null },
    fechaInicio : { type : String, required : true },
    fechaEntrega : { type : String, default : null },
    areaConocimiento : { type : String },
    resumen : { type : String, default : null },
});

const tesis = mongoose.model('Tesis', tesisModel);

export default tesis;