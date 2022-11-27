const db = require('../config/db_sequelize');
const candidato = require('../models/candidato');
module.exports = {
    async cadastrarCandidato(req, res){
        db.Candidato.create({
            nome: req.body.nome,
            partido: req.body.partido,
            cargo: req.body.cargo
        });
        return res.redirect("/");
    },
    async editarCandidato(req, res){
        return res.redirect("/");
    },
    async deletarCandidato(req, res){
        return res.redirect("/");
    },
    async getCandidatos(req, res){
        return res.redirect("/");
    },
    async getResultados(req, res){
        return res.redirect("/");
    }
}