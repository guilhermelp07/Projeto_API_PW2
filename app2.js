/* Testes realizados com dados genéricos
 * Esta aplicação consome todas as rotas e faz o tratamento dos retornos da API
 *
 * 
 */

const express = require("express");
const unirest = require("unirest");
const app = express();

//Teste do Post
app.get('/testePostCandidato', async (req,res)=>{
    var resposta = await unirest.post('http://localhost:8081/api/candidato')
    .send({"nome": "Bolsonaro", "partido": "PL", "cargo": "0"});
    res.send(resposta);
});

app.get('/testePutCandidato/:id', async (req,res)=>{
    const {id} = req.params;
    var resposta = await unirest.put('http://localhost:8081/api/candidato/'+id)
    .send({"nome": "Jair Bolsonaro", "partido": "Partido Liberal", "cargo": "0"});
    res.send(resposta);
})

app.get('/testeGetCandidatos', async (req,res)=>{
    var resposta = await unirest.get('http://localhost:8081/api/candidato');
    console.log(resposta.body.data.candidatos[0].nome);
    res.send(resposta);
});

app.get('/testeGetCandidato/:id', async (req,res)=>{
    const {id} = req.params;
    var resposta = await unirest.get('http://localhost:8081/api/candidato/'+id);
    res.send(resposta);
});

app.listen(3000, function(){ console.log("Servidor no http://localhost:3000")});