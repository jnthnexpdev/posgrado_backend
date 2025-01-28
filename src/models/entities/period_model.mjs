import mongoose, { Schema } from 'mongoose';

const periodModel = new Schema({
    periodo : { type: String, required : true },
    fechaRegistro : { type: String },
    horaRegistro : { type: String },
    estudiantes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Alumnos'
    }]
});

const period = mongoose.model('Periodos', periodModel);

export default period;