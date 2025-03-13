import pdfMake from "./pdf_fonts.mjs";
import { convertImageToBase64URL } from "./pdf_images.mjs";
import { pdfStyles } from "./pdf_styles.mjs";
import { getDateTime } from "../datetime.mjs";

// Función para obtener el header del PDF
function getHeaderAndLogos({ period = 'Enero - Junio 2025' } = {}) {
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
        { text: 'COORDINACIÓN DE POSGRADO', style: 'header' },
        {
            stack: [
                {
                    text: [
                        'Listado de alumnos registrados en el sistema en el periodo ', { text: `${period}.`, decoration: 'underline' },
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
            widths: ['10%', '30%', '20%', '25%', '15%'],
            body: [
                [
                    { text: 'No', style: 'tableHeader' },
                    { text: 'Nombre', style: 'tableHeader' },
                    { text: 'N Control', style: 'tableHeader' },
                    { text: 'Correo', style: 'tableHeader' },
                    { text: 'F Registro', style: 'tableHeader' }
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

// Función principal para exportar los estudiantes en PDF
export async function exportStudents(data) {
    return new Promise(async (resolve, reject) => {
        const { fecha, hora } = await getDateTime();
        const date = fecha || "Not specified";

        let content = [
            ...getHeaderAndLogos('Enero - Junio 2025'),
            getNewTable()
        ];

        data.forEach((item, index) => {
            if (index % 15 === 0 && index !== 0) {
                content.push({ text: '', pageBreak: 'before' });
                content.push(...getHeaderAndLogos('Enero - Junio 2025'));
                content.push(getNewTable());
            }
            content[content.length - 1].table.body.push([
                { text: `${index + 1}`, style: 'tableData' },
                { text: item.nombre, style: 'tableData' },
                { text: item.numeroControl, style: 'tableData' },
                { text: item.correo, style: 'tableData' },
                { text: item.fechaRegistro, style: 'tableData' }
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