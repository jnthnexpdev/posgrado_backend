import express from 'express';
import { getDateTime } from './utils/datetime.mjs';

const app = express();
const { fecha, hora } = await getDateTime();

app.listen(3000, async() => {
    console.log(`Servidor NodeJS en puerto 3000 a ${hora} del ${fecha}`);
})

export default app;