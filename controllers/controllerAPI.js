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
        var candidato = await db.Candidato.findOne({where: {id: req.params.id}});
        if(!candidato || candidato == undefined){
            console.log(candidato);
            return res.status(204).json();
        }
    
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
    },
    async registrarVoto(req, res){
        var candidato = req.params.id
        if(candidato == undefined){
            candidato = 0
        }
        var intencao = db.IntencaoVoto.findOne({where: {id: candidato}});
        if(intencao && candidato != 0){
            return res.status(204).json();
        }
        else {
            await db.IntencaoVoto.create({
                cpf: '123',
                sexo: 'M',
                candidatoid: candidato
            }).then((intencaoVoto)=>{
                return res.json({"data": {"status": "success", intencaoVoto}});
            });
        }
    },
    async deletarVoto(req, res){
        
    }
}