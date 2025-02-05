import pdfMake from "./pdf_fonts.mjs"; // Importamos pdfMake ya configurado
import { convertImageToBase64URL } from "./pdf_images.mjs";
import { pdfStyles } from "./pdf_styles.mjs";
import { getDateTime } from "../datetime.mjs";

// Función para obtener el header del PDF
function getHeaderAndLogos({ fecha = 'Not Specified' } = {}) {
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
                        'Listado de asesores registrados en el sistema de posgrado hasta  ', { text: `${fecha}.`, decoration: 'underline' },
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
                    { text: 'Correo', style: 'tableHeader' },
                    { text: 'F Registro', style: 'tableHeader' },
                    { text: 'Cuenta', style: 'tableHeader' }
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

// Función principal para exportar los periodos en PDF
export async function exportTeachers(data) {
    return new Promise(async (resolve, reject) => {
        const { fecha, hora } = await getDateTime();
        const date = fecha || "Not specified";

        let content = [
            ...getHeaderAndLogos({ fecha : date }),
            getNewTable()
        ];

        data.forEach((item, index) => {
            if (index % 15 === 0 && index !== 0) {
                content.push({ text: '', pageBreak: 'before' });
                content.push(...getHeaderAndLogos({ fecha : date }));
                content.push(getNewTable());
            }
            content[content.length - 1].table.body.push([
                { text: `${index + 1}`, style: 'tableData' },
                { text: item.nombre, style: 'tableData' },
                { text: item.correo, style: 'tableData' },
                { text: item.fechaRegistro, style: 'tableData' },
                { text: item.estatusCuenta, style: 'tableData' }
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