import mongoose from 'mongoose';
const schema = mongoose.Schema;

const revisionModel = new schema({
    idAsignacion : { type : mongoose.Schema.Types.ObjectId, ref : 'Asignaciones', required : true },
    nombreAsignacion : { type : String, required : true },
    fechaAsignacion : { type : String, required : true },

    alumno : { type : mongoose.Schema.Types.ObjectId, ref : 'Alumnos', required : true },
    tesis : { type : mongoose.Schema.Types.ObjectId, ref : 'Tesis' },
    linkEntrega : { type : String, trim : true },
    estatusEntrega : { 
        type: String, 
        enum: ["Pendiente", "Entregada", "Calificada"], 
        default: "Pendiente"  
    },
    fechaEntrega : { type : String, trim : true }, 
    horaEntrega : { type : String, trim : true },
    calificacion : { type : Number, default : null, min : 0, max : 100 },
    comentarios : [
        {
            nombreUsuario : { type : String, required : true },
            comentario : { type : String, required : true },
            fechaComentario : { type : String, required : true },
        }
    ]
});

const revision = mongoose.model('Revisiones', revisionModel);

export default revision;