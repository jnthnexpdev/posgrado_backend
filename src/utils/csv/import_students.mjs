import studentModel from '../../models/users/student_model.mjs';
import periodModel from '../../models/entities/period_model.mjs';
import { parse } from 'csv-parse';  // Importación correcta

export async function importStudentsFromCSV(buffer, idPeriod) {
    return new Promise((resolve, reject) => {
        const dataCSV = [];  // Aquí vamos a almacenar los números de control extraídos

        // Convertimos el buffer a un string y luego lo procesamos
        const fileContent = buffer.toString('utf-8');  // Convertir el buffer a string en UTF-8

        // Usamos csv-parse para procesar el contenido del archivo CSV como string
        parse(fileContent, { columns: true, skip_empty_lines: true })
            .on('data', (row) => {
                if (row.NumeroControl) {
                    // Aseguramos que el número de control existe y lo limpiamos
                    dataCSV.push(row.NumeroControl.trim());
                }
            })
            .on('end', async () => {
                try {
                    // Verificamos si hay datos en el CSV
                    if (dataCSV.length === 0) {
                        return reject(new Error("El archivo CSV no contiene números de control válidos"));
                    }

                    // 1. Buscar los alumnos por número de control
                    const students = await studentModel.find({ numeroControl : { $in: dataCSV } }, '_id');

                    if (students.length === 0) {
                        return reject(new Error("No se encontraron alumnos con los números de control proporcionados"));
                    }

                    const studentIds = students.map(student => student._id); // Extraer solo los ObjectId

                    // 2. Buscar el periodo y actualizarlo con los nuevos alumnos
                    const period = await periodModel.findById(idPeriod);
                    if (!period) {
                        return reject(new Error("El periodo no existe"));
                    }

                    // 3. Filtrar los alumnos que ya están registrados
                    const newStudents = studentIds.filter(id => !period.alumnos.includes(id));

                    if (newStudents.length === 0) {
                        return reject(new Error("Todos los alumnos ya están registrados en el periodo"));
                    }

                    period.alumnos.push(...newStudents);
                    await period.save();

                    resolve({ message: "Alumnos agregados exitosamente", added: newStudents.length });
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', (error) => {
                reject(new Error(`Error al procesar el archivo CSV: ${error.message}`));
            });
    });
}
