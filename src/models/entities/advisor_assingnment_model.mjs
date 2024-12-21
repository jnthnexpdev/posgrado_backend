import mongoose from 'mongoose';
const schema = mongoose.Schema;

const advisorAssignmentModel = new schema({
    asesor : { type : mongoose.Schema.Types.ObjectId, ref : 'Asesores', required : true },
    alumno : { type : mongoose.Schema.Types.ObjectId, ref : 'Alumnos', required : true },
    periodo : { type: String, required: true },
    fechaAsignacion : { type : String, required : true },
    notas : { type : String, required : false }
});

const advisorAssignment = mongoose.model('Asesorados', advisorAssignmentModel);

export default advisorAssignment;