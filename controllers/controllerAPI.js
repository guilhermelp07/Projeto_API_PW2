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
        var intencoes = {};
        if(candidato.cargo == 0)
            intencoes = await db.IntencaoVoto.findOne({where: {presidente: req.params.id}});
        else
            intencoes = await db.IntencaoVoto.findOne({where: {governador: req.params.id}});
        if(intencoes){
            console.log("if das intencoes")
            return res.status(204).json({"data": {"status": "error", "errorMessage": "Impossível deletar um candidato que já possua intenções de voto!"}});
        }
        else {
            console.log("else das intencoes");
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
        var sexoParm = 'X';
        var cargoParm = 0;
        if(req.body.sexo != undefined && req.body.sexo)
            sexoParm = req.body.sexo;
        if(req.body.cargo != undefined && req.body.cargo)
            cargoParm = parseInt(req.body.cargo);
        
        const queryPres = " select "+
                        " case "+
                          "  when iv.presidente = -1 then 'Nulos'"+
                          "  when iv.presidente = 0 then 'Brancos'"+
                          " else c.nome "+
                       " end as presidente,"+
                        " cast("+
                            " ("+
                                " cast(count(1) as decimal(10, 2)) / cast("+
                                    " ("+
                                        " select"+
                                            " count(1)"+
                                        " from"+
                                            " intencaovotos"+
                                        " where"+
                                            " ("+
                                                " sexo = '" + sexoParm + "'"+
                                                " or '" + sexoParm + "' = 'X'"+
                                            " )"+
                                    " ) as decimal(10, 2)"+
                                 " )"+
                            " ) * 100 as decimal(10, 2)"+
                        " ) || '%' as percentual,"+
                        " count(1) as total "+
                    " from "+
                        " intencaovotos as iv "+
                        " left join candidatos as c on(c.id = iv.presidente) "+
                    " where "+
                     "   ( "+
                           " iv.sexo = '" + sexoParm + "' "+
                            " or '" + sexoParm + "' = 'X' "+
                        " ) "+
                    " group by "+
                        " c.nome, "+
                        " iv.presidente ";
        const queryGov = " select "+
                        " case "+
                        "  when iv.governador = -1 then 'Nulos'"+
                        "  when iv.governador = 0 then 'Brancos'"+
                        " else c.nome "+
                    " end as governador,"+
                        " cast("+
                            " ("+
                                " cast(count(1) as decimal(10, 2)) / cast("+
                                    " ("+
                                        " select"+
                                            " count(1)"+
                                        " from"+
                                            " intencaovotos"+
                                        " where"+
                                            " ("+
                                                " sexo = '" + sexoParm + "'"+
                                                " or '" + sexoParm + "' = 'X'"+
                                            " )"+
                                    " ) as decimal(10, 2)"+
                                " )"+
                            " ) * 100 as decimal(10, 2)"+
                        " ) || '%' as percentual,"+
                        " count(1) as total "+
                    " from "+
                        " intencaovotos as iv "+
                        " left join candidatos as c on(c.id = iv.governador) "+
                    " where "+
                    "   ( "+
                        " iv.sexo = '" + sexoParm + "' "+
                            " or '" + sexoParm + "' = 'X' "+
                        " ) "+
                    " group by "+
                        " c.nome, "+
                        " iv.governador "+
                    " order by "+
                    "    count(1) ";
        var query = queryPres;
        if(cargoParm == 1) query = queryGov;

        const [result, metadata] = await db.sequelize.query(query);
        return res.status(200).json(result);
    },
    async registrarVoto(req, res){
        var cpf = req.body.cpf;
        var sexo = req.body.sexo;
        var gov = req.body.governador;
        var pres = req.body.presidente;
        var cargo = req.body.cargo;
        var erro = false;

        if(!cpf || !sexo)
            return res.status(400).json({"data": {"status": "error", "errorMessage": "Parâmetro(s) nulo(s)!"}});
        
        if((gov == undefined ? 0 : gov) > 0){
            var govBusca = await db.Candidato.findOne({where: {id: gov, cargo: 1}});
            if(!govBusca) erro = true;
        }
        if((pres == undefined ? 0 : pres) > 0){
            var presBusca = await db.Candidato.findOne({where: {id: pres, cargo: 0}});
            if(!presBusca) erro = true
        }

        if(erro)
            return res.status(204).json({"data": {"status": "no content", "message": "Candidatos não encontrados ou cargos incorretos."}});

        if(gov == undefined || !gov) gov = -1;
        if(pres == undefined || !pres) pres = -1;

        var intencao = await db.IntencaoVoto.findOne({where: {cpf: cpf}});
        if(intencao){
            return res.status(401).json({"data": {"status": "error", "errorMessage": "Já existe uma intenção de voto do eleitor para esse cargo."}});
        }
        var intencaoVoto = await db.IntencaoVoto.create({
            cpf: cpf,
            sexo: sexo,
            governador: gov,
            presidente: pres
        });
        if(intencaoVoto)
            return res.status(201).json({"data": {"status": "success", "message": "Intenção de voto registrada com sucesso", intencaoVoto}});
        else
            return res.status(502).json({"data": {"status": "internal server error", "errorMessage": "Não foi possível criar a intenção de voto"}});
    },
    async deletarVoto(req, res){
        var cpf = req.body.cpf;
        if((cpf || cpf != undefined) && cpf != ''){
            voto = db.IntencaoVoto.destroy({where: {cpf: cpf}});
            if(voto)
                return res.status(202).json({"data": {"status": "success", "message": "Intenção de voto excluída da base de dados", voto}});
            else
                return res.status(204).json({"data": {"status": "internal server error", "message": "Intenção de voto não encontrada", voto}});
        }
        else
            return res.status(400).json({"data": {"status": "internal server error", "errorMessage": "Parâmetro nulo"}});
    }
}