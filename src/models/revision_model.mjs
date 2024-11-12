import mongoose from mongoose;
const schema = mongoose.Schema;

const revisionModel = new schema({
    tesis : { type : mongoose.Schema.Types.ObjectId, ref : 'Tesis', required : true },
    asesor : { type : mongoose.Schema.Types.ObjectId, ref : 'Asesor', required : true },
    alumno : { type : mongoose.Schema.Types.ObjectId, ref : 'Alumno', required : true },
    detalles : [{
        nombreRevision : { type: String },
        fechaLimite : { type: String },

        //Informacion de la entrega por parte del alumno
        fechaEntrega : { type: String },
        horaEntrega : { type: String },

        //Informacion de la revision por parte del asesor
        fechaRevision : { type: String },
        horaRevision : { type: String },
        estatus : { type: String },

        //Comentarios u observaciones
        comentarios : [{
            idUsuario : { type : mongoose.Schema.Types.ObjectId, required : true },
            contenido : { type: String },
            fechaComentario : { type : String },
            horaComentario : { type : String }
        }]
    }]
});

const revision = mongoose.model('Revisiones', revisionModel);

export default revision;