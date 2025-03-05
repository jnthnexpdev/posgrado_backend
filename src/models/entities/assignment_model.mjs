import mongoose from 'mongoose';
const schema = mongoose.Schema;

const assingmentModel = new schema({
    nombre : { type : String, required : true },
    descripcion : { type : String, required : true },
    fechaAsignacion : { type : String, required : true },
    fechaLimite : { type : String, required : true },
    permitirEntrega : { type : Boolean, default : true },
    periodo : { type : String, required : true },
    asesor : {
        idAsesor : { type : mongoose.Schema.Types.ObjectId, ref : 'Asesores', required : true },
        nombreAsesor : { type : String, required : true }
    },
    alumnos : [{
        idAlumno : { type : mongoose.Schema.Types.ObjectId, ref : 'Alumnos', required : true },
        nombreAlumno : { type : String, required : true }
    }]
});

const assignment = mongoose.model('Asignaciones', assingmentModel);

export default assignment;