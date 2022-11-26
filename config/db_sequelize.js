const Sequelize = require('sequelize');
const sequelize = new Sequelize('web2_projeto_bolao' , 'postgres', 'sql#123', { //trocar a senha pro teu banco, animal
    host: 'localhost',
    dialect: 'postgres'
  });

var db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Usuario = require('../models/usuario.js')(sequelize, Sequelize);

module.exports = db;