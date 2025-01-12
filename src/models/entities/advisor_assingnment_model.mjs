import mongoose from 'mongoose';
const schema = mongoose.Schema;

const advisorAssignmentModel = new schema({
    asesor: {
        asesorId : { type : mongoose.Schema.Types.ObjectId, ref : 'Asesores', required : true },
        nombre : { type : String, required : true, trim: true },
    },
    alumno: {
        alumnoId : { type : mongoose.Schema.Types.ObjectId, ref : 'Alumnos', required : true },
        nombre : { type : String, required : true, trim: true },
        correo : { type : String, required : true, trim: true, unique : true },
        numeroControl : { type : String, required : true, trim : true, unique : true },
    },
    periodo : { type: String, required: true },
    fechaAsignacion : { type : String, required : true },
    notas : { type : String, required : false }
});

const advisorAssignment = mongoose.model('Asesorados', advisorAssignmentModel);

export default advisorAssignment;