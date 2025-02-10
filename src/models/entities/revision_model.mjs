import mongoose from mongoose;
const schema = mongoose.Schema;

const revisionModel = new schema({
    asignacion : { type : mongoose.Schema.Types.ObjectId, ref : 'Asignaciones', required : true },
    alumno : { type : mongoose.Schema.Types.ObjectId, ref : 'Alumnos', required : true },
    tesis : { type : mongoose.Schema.Types.ObjectId, ref : 'Tesis' },
    linkEntrega : { type : String, trim : true },
    fechaEntrega : { type : String, trim : true },
    calificacion : { type : Numbrer, default : null, min : 0, max : 100 },
    comentarios : [
        {
            nombreUsuario : { type : String, required : true },
            mensaje : { type : String, required : true },
            fechaComentario : { type : String, required : true },
        }
    ]
});

const revision = mongoose.model('Revisiones', revisionModel);

export default revision;