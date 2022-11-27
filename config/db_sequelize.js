const Sequelize = require('sequelize');
const sequelize = new Sequelize('web2_API' , 'postgres', 'sql#123', { //trocar a senha pro teu banco, animal
    host: 'localhost',
    dialect: 'postgres'
  });

var db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Candidato = require('../models/candidato.js')(sequelize, Sequelize);
db.IntencaoVoto = require('../models/intencaoVoto.js')(sequelize, Sequelize);

db.Candidato.hasMany(db.IntencaoVoto, {as: 'intencaovotos', foreignKey: 'candidatoid'});

module.exports = db;