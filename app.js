const routes = require('./routers/route');
const handlebars = require('express-handlebars');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const path = require('path');
const express = require('express');
const swaggerUI = require('swagger-ui-express');
const db = require('./config/db_sequelize');
const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const swaggerDocument = require('./swagger.json');
app.use(express.urlencoded({extended: true}));

app.use("/api-docs",swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(routes);

/*
db.sequelize.sync({force: true}).then(() => {
    console.log('{ force: true } | Gerando Banco de Dados...');
});*/

app.listen(8081, function(){
    console.log("Servidor no http://localhost:8081");
});