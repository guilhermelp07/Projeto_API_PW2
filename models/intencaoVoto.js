module.exports = (sequelize, Sequelize) => {
    const intencaoVoto = sequelize.define('intencaovoto', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        cpf: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        sexo: {
            type: Sequelize.STRING,
            allowNull: false
        },
        candidato: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    });
    return intencaoVoto;
}