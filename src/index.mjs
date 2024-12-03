import express from 'express';
import router from './routes/index_routes.mjs';
import bodyParser from 'body-parser';
import { getDateTime } from './utils/datetime.mjs';
import { connectToMongoDB } from './db/connection.mjs';

const app = express();
// const { fecha, hora } = await getDateTime();

//Json
app.use(bodyParser.json({limit : '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended : true}));
app.use(bodyParser.json());

//Headers y metodos
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", 'http://localhost:4200');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    next();
});

connectToMongoDB();

app.use(router);

app.listen(3000, async() => {
    // console.log(`${hora}, ${fecha}`);
    console.log(`Servidor backend en el puerto 3000`);
})

export default app;