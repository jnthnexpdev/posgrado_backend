import mongoose from "mongoose";
const schema = mongoose.Schema;

const publicationsModel = new schema({
    revista : { type : String, required : true },
    alumno : { type : mongoose.Schema.Types.ObjectId, ref : 'Alumnos', required : true },
    url : { type : String, default : null },
    fechaPublicacion : { type : String, required : true },
    fechaRegistro : { type : String, default : null },
});

const publications = mongoose.model('Publicaciones', publicationsModel);

export default publications;