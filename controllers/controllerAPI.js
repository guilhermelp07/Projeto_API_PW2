const db = require('../config/db_sequelize');
const candidato = require('../models/candidato');
module.exports = {
    async cadastrarCandidato(req, res){
        var cargo = req.body.cargo;
        console.log("cargo atual: " + cargo);
        await db.Candidato.create({
            nome: req.body.nome,
            partido: req.body.partido,
            cargo: cargo
        }).then((candidato)=>{
            return res.json({"data": {"status": "success", candidato}});
        });
    },
    async editarCandidato(req, res){
        await db.Candidato.update({nome: req.body.nome, partido: req.body.partido, cargo: req.body.cargo}, {where:{id: req.params.id}}).then((candidato)=>{
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
    
        var intencoes = await db.IntencaoVoto.findOne({where: {candidato: req.params.id}});
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
    async getCandidatoById(req, res){
        var candidato = await db.Candidato.findOne({where: {id: req.params.id}});
        if(candidato)
            res.json({"data": { "status": "success", candidato}});
        else
            res.status(204).json();
    },
    async getResultados(req, res){
        return res.redirect("/");
    },
    async registrarVoto(req, res){
        var cpfTeste = '1234';
        var candidato = req.params.id;

        var intencao = await db.IntencaoVoto.findOne({where: {cpf: cpfTeste}}); //req.body.cpf
        if(intencao){
            return res.status(204).json();
        }
        await db.IntencaoVoto.create({
            cpf: cpfTeste,
            sexo: 'M',
            candidatoid: candidato
        }).then((intencaoVoto)=>{
            return res.json({"data": {"status": "success", intencaoVoto}});
        });
    },
    async deletarVoto(req, res){
        
    }
}