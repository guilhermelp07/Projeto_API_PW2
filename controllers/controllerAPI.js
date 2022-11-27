const db = require('../config/db_sequelize');
const candidato = require('../models/candidato');
module.exports = {
    async cadastrarCandidato(req, res){
        // await db.Candidato.create({
        //     nome: req.body.nome,
        //     partido: req.body.partido,
        //     cargo: req.body.cargo
        // });
        await db.Candidato.create({
            nome: 'teste',
            partido: 'teste',
            cargo: 'teste'
        });
        return res.redirect("/home");
    },
    async editarCandidato(req, res){
        await db.Candidato.update({nome: 'req.body.nome', partido: req.body.partido, cargo: req.body.cargo}, {where:{id: req.params.id}}).then((candidato)=>{
            return res.json({"data": {"status": "success", candidato}});
        });
        return res.json({"data": {"status": "error"}});
    },
    async deletarCandidato(req, res){
        var intencoes = await db.IntencaoVoto.findOne({where: {candidatoid: req.params.id}});
        if(intencoes){
            return res.status(204).json();
        }
        else {
            await db.Candidato.destroy({where: {id: req.params.id}}).then((candidato)=>{
                res.json({"data": {"status": "success", candidato}});
            });
        }
    },
    async getCandidatos(req, res){
        var candidatos = await db.Candidato.findAll();
        if(candidatos)
            res.json({"data": { "status": "success", candidatos}});
        else
            res.status(204).json();
    },
    async getResultados(req, res){
        return res.redirect("/");
    }
}