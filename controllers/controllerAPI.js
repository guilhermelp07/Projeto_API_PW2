const db = require('../config/db_sequelize');
var cargoParm = '0';
var sexoParm = 'X';
const query =   " select" +
                "   case " +
                "     when iv.candidato = -1 then \'Nulos\'"+
                "     when iv.candidato = 0 then \'Brancos\'"+
                "     else c.nome "+
                "   end as candidato, "+
                "   cast((cast(count(1) as decimal(10,2)) / cast((select count(1) from intencaovotos where cargo = " + cargoParm + " and (sexo = '" + sexoParm + "' or '" + sexoParm + "' = 'X')) as decimal(10,2))) * 100 as decimal(10,2)) || '%' as percentual, "+
                "   count(1) as total "+
                " from "+
                "   intencaovotos as iv "+
                "   left join candidatos as c "+
                "     on( "+
                "       c.id = iv.candidato "+
                "     ) "+
                " where "+
                "   iv.cargo = " + cargoParm + " and "+
                "   ( iv.sexo = '" + sexoParm + "' or '" + sexoParm + "' = 'X' ) "+
                " group by "+
                "   c.nome, "+
                "   iv.candidato ";
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
        sexoParm = 'X';
        var sexo = req.body.sexo; 
        if(sexo != undefined && sexo)
            sexoParm = sexo;

        const [result, metadata] = await db.sequelize.query(query);
        return res.status(200).json(result);
    },
    async registrarVoto(req, res){
        var cpf = req.body.cpf;
        var sexo = req.body.sexo;
        var candidato = req.body.candidato;
        var cargo = req.body.cargo;

        if(!cpf || !sexo || !cargo)
            return res.status(400).json({"data": {"status": "error", "errorMessage": "Parâmetro(s) nulo(s)!"}});
        if((candidato == undefined ? 0 : candidato) > 0){
            const [candidatoBusca, metadata] = await db.sequelize.query('select cargo from candidatos where id = ' + candidato);
            if(candidatoBusca && candidatoBusca[0]){
                console.log(candidatoBusca[0]);
                var cargoBusca = candidatoBusca[0].cargo;
                console.log(cargoBusca);
                if(cargoBusca != cargo)
                    return res.status(400).json({"data": {"status": "error", "errorMessage": "Candidato não está concorrendo ao cargo informado"}});
            }
            else{
                console.log("erro RETORNOU");
                return res.status(204).json({"data": {"status": "no content", "message": "Candidato não encontrado"}});
            }
        }

        if(candidato == undefined || !candidato) candidato = -1;

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