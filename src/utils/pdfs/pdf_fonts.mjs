import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
import fs from "node:fs";
import path from "node:path";

// Configurar vfs para pdfMake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// Función para cargar fuentes personalizadas
export function setupFonts() {
    const fontFiles = [
        'Montserrat-Black.ttf', 'Montserrat-BlackItalic.ttf',
        'Montserrat-Bold.ttf', 'Montserrat-BoldItalic.ttf',
        'Montserrat-ExtraBold.ttf', 'Montserrat-ExtraBoldItalic.ttf',
        'Montserrat-ExtraLight.ttf', 'Montserrat-ExtraLightItalic.ttf',
        'Montserrat-Italic.ttf', 'Montserrat-Light.ttf',
        'Montserrat-LightItalic.ttf', 'Montserrat-Medium.ttf',
        'Montserrat-MediumItalic.ttf', 'Montserrat-Regular.ttf',
        'Montserrat-SemiBold.ttf', 'Montserrat-SemiBoldItalic.ttf',
        'Montserrat-Thin.ttf', 'Montserrat-ThinItalic.ttf'
    ];
    fontFiles.forEach(font => {
        try {
            const fontPath = path.resolve('../posgrado_backend/src/assets/fonts', font);
            pdfMake.vfs[font] = fs.readFileSync(fontPath).toString('base64');
        } catch (error) {
            console.error(`Error loading font file ${font}:`, error);
            throw error;
        }
    });
}

// Definir las fuentes personalizadas para pdfMake
export function setPdfMakeFonts() {
    pdfMake.fonts = {
        Montserrat: {
            normal: 'Montserrat-Regular.ttf',
            bold: 'Montserrat-Bold.ttf',
            italics: 'Montserrat-Italic.ttf',
            bolditalics: 'Montserrat-BoldItalic.ttf'
        }
    };
}

// Ejecutar la configuración de fuentes
setupFonts();
setPdfMakeFonts();

// Exportar pdfMake para usarlo en otros archivos
export default pdfMake;