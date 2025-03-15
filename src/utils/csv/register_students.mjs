import studentModel from '../../models/users/student_model.mjs';
import periodModel from '../../models/entities/period_model.mjs';
import { parse } from 'csv-parse';
import { getDateTime } from '../datetime.mjs';

export async function registerStudentsCSV(file, idPeriod, password) {
    return new Promise((resolve, reject) => {
        const studentsToRegister = [];
        const errors = [];
        const savePromises = []; // Array para almacenar las promesas de guardado

        const fileContent = new TextDecoder('utf-8').decode(file);

        parse(fileContent, { 
            columns: true, 
            skip_empty_lines: true, 
            delimiter: ',' 
        })
        .on('data', (row) => {
            const { nombre, correo, numeroControl } = row;

            // Verifica que no falte información
            if (!nombre || !correo || !numeroControl) {
                errors.push(`Faltan datos para el alumno con número de control: ${numeroControl}`);
                return;
            }

            const promise = new Promise(async (resolve, reject) => {
                try {
                    const { hora, fecha } = await getDateTime();
                    const student = new studentModel({
                        nombre,
                        correo,
                        numeroControl,
                        password,
                        tipoCuenta: 'Alumno',
                        estatusCuenta: 'Activa',
                        fechaRegistro: fecha,
                        horaRegistro: hora,
                        sesion: {
                            ultimaSesion: '',
                            codigoAcceso: '',
                            validezCodigoAcceso: false,
                        }
                    });

                    await student.save();
                    studentsToRegister.push(student._id);
                    resolve(); // Resolve la promesa cuando el estudiante se guarda correctamente
                } catch (error) {
                    errors.push(`Error al procesar al alumno con número de control: ${row.numeroControl}. Error: ${error.message}`);
                    reject(error); // Rechaza la promesa en caso de error
                }
            });

            savePromises.push(promise); // Agrega la promesa al array de promesas
        })
        .on('end', async () => {
            try {
                // Espera a que todas las promesas de guardado se resuelvan
                await Promise.all(savePromises);

                if (studentsToRegister.length > 0) {
                    console.log('Entrando al periodooooo');
                    const period = await periodModel.findById(idPeriod);
                    if (!period) {
                        return reject(new Error("El periodo no existe"));
                    }

                    period.alumnos.push(...studentsToRegister);
                    await period.save();

                    resolve({
                        message: 'Alumnos registrados y agregados al periodo exitosamente',
                        added: studentsToRegister.length
                    });
                }

                if (errors.length > 0) {
                    reject({
                        message: 'Se encontraron errores al procesar algunos alumnos',
                        errors: errors
                    });
                }
            } catch (error) {
                reject(new Error(`Error al finalizar el proceso: ${error.message}`));
            }
        })
        .on('error', (error) => {
            reject(new Error(`Error al procesar el archivo CSV: ${error.message}`));
        });
    });
}
