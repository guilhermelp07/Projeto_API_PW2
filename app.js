//const routes = require('./routers/route');
const handlebars = require('express-handlebars');
var cookieParser = require('cookie-parser');
var session = require('express-session');
//const middlewares = require('./middlewares/middlewares');
const express = require('express');
const swaggerUI = require('swagger-ui-express');
const db = require('./config/db_sequelize');
const app = express();

app.use(cookieParser());
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static("images"));

const swaggerDocument = require('./swagger.json');
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api-docs",swaggerUI.serve, swaggerUI.setup(swaggerDocument));
//app.use(middlewares.logRegister, middlewares.sessionControl, middlewares.checkCreate);
//app.use(routes);

/*
db.sequelize.sync({force: true}).then(() => {
    console.log('{ force: true } | Gerando Banco de Dados. Aguarde...');
    db.Usuario.create({
        login: 'adm',
        nome: 'Administrador',
        senha: '123',
        tipousuario: 0
    });
});*/

app.listen(8081, function(){
    console.log("Servidor no http://localhost:8081");
});

console.log("bn")