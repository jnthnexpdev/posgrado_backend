import express from 'express';
import { getDateTime } from './utils/datetime.mjs';

const app = express();
const { fecha, hora } = await getDateTime();

app.listen(3000, async() => {
    console.log(`Server on port 3000 ${hora} ${fecha}`);
})

export default app;