module.exports = (sequelize, Sequelize) => {
    const Candidato = sequelize.define('candidato', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        nome: {
            type: Sequelize.STRING,
            allowNull: false
        },
        partido: {
            type: Sequelize.STRING,
            allowNull: false
        },
        cargo: {
            type: Sequelize.STRING, //dá pra fazer com um int pra representar Governador ou Presidente, já que são só esses dois cargos
            allowNull: false
        }
    });
    return Candidato;
}