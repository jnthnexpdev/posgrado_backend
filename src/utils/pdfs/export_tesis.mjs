import pdfMake from "./pdf_fonts.mjs";
import { convertImageToBase64URL } from "./pdf_images.mjs";
import { pdfStyles } from "./pdf_styles.mjs";
import { getDateTime } from "../datetime.mjs";

// Función para obtener el header del PDF
function getHeaderAndLogos(
    { 
        period = 'Periodo no especificado', 
    } = {}) {
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
                        'Lista de tesis registradas en el sistema de posgrado del periodo ', { text: `${period}.`, decoration: 'underline' }
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
            widths: ['5%', '15%', '20%', '15%', '15%', '15%', '15%'],
            body: [
                [
                    { text: 'No', style: 'tableHeader' },
                    { text: 'Alumno', style: 'tableHeader' },
                    { text: 'Tesis', style: 'tableHeader' },
                    { text: 'Asesor', style: 'tableHeader' },
                    { text: 'Revisión', style: 'tableHeader' },
                    { text: 'Estatus', style: 'tableHeader' },
                    { text: 'Aprobada', style: 'tableHeader' }
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

// Función principal para exportar los entregas de una asignacion en PDF
export async function exportTesis( tesis, period){
    return new Promise(async (resolve, reject) => {

        let content = [
            ...getHeaderAndLogos({ period }),
            getNewTable()
        ];

        tesis.forEach((item, index) => {
            if (index % 15 === 0 && index !== 0) {
                content.push({ text: '', pageBreak: 'before' });
                content.push(...getHeaderAndLogos({ period }));
                content.push(getNewTable());
            }
            content[content.length - 1].table.body.push([
                { text: `${index + 1}`, style: 'tableData' },
                { text: item.nombreAlumno, style: 'tableData' },
                { text: item.titulo, style: 'tableData' },
                { text: item.nombreAsesor, style: 'tableData' },
                { text: item.fechaEntrega || '', style: 'tableData' },
                { text: item.estatus, style: 'tableData' },
                { text: item.aprobacion.fechaAprobacion || '-', style: 'tableData' },
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