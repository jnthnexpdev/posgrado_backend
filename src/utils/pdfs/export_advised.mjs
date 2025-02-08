import pdfMake from "./pdf_fonts.mjs";
import { convertImageToBase64URL } from "./pdf_images.mjs";
import { pdfStyles } from "./pdf_styles.mjs";
import { getDateTime } from "../datetime.mjs";

// Función para obtener el header del PDF
function getHeaderAndLogos({ teacher = 'Asesor no definido', period = 'Periodo no especificado' } = {}) {
    return [
        {
            columns: [
                {
                    image: convertImageToBase64URL('../posgrado_backend/src/assets/tnm.png'),
                    fit: [100, 100]
                },
                {
                    image: convertImageToBase64URL('../posgrado_backend/src/assets/itc.png'),
                    fit: [60, 90],
                    alignment: 'right'
                }
            ]
        },
        { text: 'INSTITUTO TECNOLÓGICO DE CUAUTLA', style: 'mainHeader' },
        { text: 'COORDINACION DE POSGRADO', style: 'header' },
        {
            stack: [
                {
                    text: [
                        'Listado de alumnos asesorados por el/la docente ', { text: `${teacher} `, decoration: 'underline' },  'en el sistema en el periodo ', { text: `${period}.`, decoration: 'underline' },
                    ]
                }
            ],
            style: 'text'
        },
        { text: '', margin: [0, 0, 0, 10] }
    ];
}

// Función para generar la tabla
function getNewTable() {
    return {
        table: {
            headerRows: 1,
            widths: ['10%', '25%', '15%', '25%', '25%'],
            body: [
                [
                    { text: 'No', style: 'tableHeader' },
                    { text: 'Nombre', style: 'tableHeader' },
                    { text: 'N Control', style: 'tableHeader' },
                    { text: 'Correo', style: 'tableHeader' },
                    { text: 'Periodo', style: 'tableHeader' }
                ]
            ]
        },
        layout: {
            paddingLeft: (i, node) => 5,
            paddingRight: (i, node) => 5,
            paddingTop: (i, node) => 2,
            paddingBottom: (i, node) => 2,
            fillColor: (rowIndex) => rowIndex === 0 ? '#18316B' : null
        }
    };
}

// Función principal para exportar los asesorados en PDF
export async function exportAdvised(students, teacher, period){
    return new Promise(async (resolve, reject) => {
        const { fecha, hora } = await getDateTime();
        const date = fecha || "Not specified";

        let content = [
            ...getHeaderAndLogos({ teacher, period }),
            getNewTable()
        ];

        students.forEach((item, index) => {
            if (index % 15 === 0 && index !== 0) {
                content.push({ text: '', pageBreak: 'before' });
                content.push(...getHeaderAndLogos({ teacher, period }));
                content.push(getNewTable());
            }
            content[content.length - 1].table.body.push([
                { text: `${index + 1}`, style: 'tableData' },
                { text: item.alumno.nombre, style: 'tableData' },
                { text: item.alumno.numeroControl, style: 'tableData' },
                { text: item.alumno.correo, style: 'tableData' },
                { text: item.periodo, style: 'tableData' }
            ]);
        });

        const docDefinition = {
            content: content,
            footer: (currentPage, pageCount) => ({
                columns: [
                    { text: `${currentPage.toString()}`, alignment: 'right', margin: [0, 0, 40, 0] }
                ]
            }),
            styles: pdfStyles,
            defaultStyle: { font: 'Montserrat' }
        };

        const pdfDoc = pdfMake.createPdf(docDefinition);
        pdfDoc.getBuffer((buffer) => {
            resolve(buffer);
        });
    });
}