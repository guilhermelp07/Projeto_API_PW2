const Sequelize = require('sequelize');
const sequelize = new Sequelize('web2_API' , 'postgres', 'sql#123', {
    host: 'localhost',
    dialect: 'postgres'
  });

var db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Candidato = require('../models/candidato.js')(sequelize, Sequelize);
db.IntencaoVoto = require('../models/intencaoVoto.js')(sequelize, Sequelize);

module.exports = db;