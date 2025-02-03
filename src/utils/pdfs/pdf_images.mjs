import fs from "fs";

export function convertImageToBase64URL(filename, imageType = 'png') {
    try {
        const buffer = fs.readFileSync(filename);
        const base64String = Buffer.from(buffer).toString('base64');
        return `data:image/${imageType};base64,${base64String}`;
    } catch (error) {
        throw new Error(`El archivo ${filename} no existe.`);
    }
}