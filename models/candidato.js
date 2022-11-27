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
            type: Sequelize.INTEGER, //0 - Governador, 1 - Presidente
            allowNull: false
        }
    });
    return Candidato;
}