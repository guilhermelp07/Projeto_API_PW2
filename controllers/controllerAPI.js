const db = require('../config/db_sequelize');
module.exports = {
    async cadastrarCandidato(req, res){
        console.log(req.body.nome + " - " + req.body.partido + " - " + req.body.cargo);
        if(!req.body.cargo || !req.body.nome || !req.body.partido)
            return res.status(400).json({"data": {"status": "error", "errorMessage": "Impossível gravar dados. Parâmetro(s) nulo(s)!"}});
        var candidato = await db.Candidato.create({
            nome: req.body.nome,
            partido: req.body.partido,
            cargo: req.body.cargo
        });
        if(candidato)
            return res.status(201).json({"data": {"status": "success", "message": "Candidato cadastrado com sucesso!", candidato}});
        else
            return res.status(502).json({"data": {"status": "internal server error", "errorMessage": "Não foi possível cadastrar o candidato"}});
    },
    async editarCandidato(req, res){
        console.log(req.body.nome + " - " + req.body.partido + " - " + req.body.cargo);
        if(!req.body.cargo || !req.body.nome || !req.body.partido)
            return res.status(400).json({"data": {"status": "error", "errorMessage": "Impossível atualizar dados. Parâmetro(s) nulo(s)!"}});
        var candidato = await db.Candidato.update({
            nome: req.body.nome,
            partido: req.body.partido,
            cargo: req.body.cargo},
            {where:{id: req.params.id}
        });
        if(candidato)
            return res.json({"data": {"status": "success", "message": "Dados editados com sucesso", candidato}});
        else
            return res.json({"data": {"status": "error", "errorMessage": "Candidato não encontrado no banco de dados"}});
    },
    async deletarCandidato(req, res){
        var candidato = await db.Candidato.findOne({where: {id: req.params.id}});
        if(!candidato || candidato == undefined){
            return res.status(204).json({"data": {"status": "error", "errorMessage": "Candidato com o id informado não encontrado!"}});
        }
    
        var intencoes = await db.IntencaoVoto.findOne({where: {candidato: req.params.id}});
        if(intencoes){
            console.log("if das intencoes")
            return res.status(204).json({"data": {"status": "error", "errorMessage": "Impossível deletar um candidato que já possua intenções de voto!"}});
        }
        else {
            console.log("else das intencoes")
            var candidatoDelete = await db.Candidato.destroy({where: {id: req.params.id}});
            if(candidatoDelete)   
                return res.status(202).json({"data": {"status": "success", "message": "Candidato excluído da base de dados", candidato}});
            else{
                console.log("não excluiu")
                return res.status(502).json({"data": {"status": "internal server error", "message": "Não foi possível excluir o candidato", candidato}});
            }
        }
    },
    async getCandidatos(req, res){
        var candidatos = await db.Candidato.findAll();
        if(candidatos)
            res.json({"data": { "status": "success", candidatos}});
        else
            res.status(204).json({"data": {"status": "no content", "errorMessage": "Nenhum candidato cadastrado"}});
    },
    async getCandidatoById(req, res){
        var candidato = await db.Candidato.findOne({where: {id: req.params.id}});
        if(candidato)
            res.json({"data": { "status": "success", candidato}});
        else
            res.status(204).json({"data": {"status": "no content", "errorMessage": "Candidato não encontrado"}});
    },
    async getResultados(req, res){
        return res.redirect("/");
    },
    async registrarVoto(req, res){
        var cpf = req.body.cpf;
        var sexo = req.body.sexo;
        var candidato = req.body.candidato;
        var cargo = 0;

        if(!candidato || !cpf || !sexo)
            return res.status(400).json({"data": {"status": "error", "errorMessage": "Parâmetro(s) nulo(s)!"}});
        const [candidatoBusca, metadata] = await db.sequelize.query('select cargo from candidatos where id = ' + candidato);
        if(candidatoBusca && candidatoBusca[0]){
            console.log(candidatoBusca[0]);
            cargo = candidatoBusca[0].cargo;
            console.log(cargo);
        }
        else{
            console.log("erro RETORNOU");
            return res.status(204).json({"data": {"status": "no content", "message": "Candidato não encontrado"}});
        }

        var intencao = await db.IntencaoVoto.findOne({where: {cpf: cpf, cargo: cargo}});
        if(intencao){
            return res.status(401).json({"data": {"status": "error", "errorMessage": "Já existe uma intenção de voto do eleitor para esse cargo."}});
        }
        var intencaoVoto = await db.IntencaoVoto.create({
            cpf: cpf,
            sexo: sexo,
            candidato: candidato,
            cargo: cargo
        });
        if(intencaoVoto)
            return res.status(201).json({"data": {"status": "success", intencaoVoto}});
        else
            return res.status(502).json({"data": {"status": "internal server error", "errorMessage": "Não foi possível criar a intenção de voto."}});
    },
    async deletarVoto(req, res){
        
    }
}