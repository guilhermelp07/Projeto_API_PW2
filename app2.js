/* Testes realizados com dados genéricos
 * Esta aplicação consome todas as rotas e faz o tratamento dos retornos da API
 * Para testar, basta rodar o app.js e app2.js simultaneamente e inserir os endereços abaixo no navegador, localhost:3000
 * 
 */

const express = require("express");
const unirest = require("unirest");
const app = express();

//Teste do Post
app.get('/testePostCandidato', async (req,res)=>{
    var req = unirest('POST', 'http://localhost:8081/api/candidato').send(req);
    res.send(req);
});

app.get('/testePutCandidato/:id', async (req,res)=>{
    const {id} = req.params;
    var resposta = await unirest.put('http://localhost:8081/api/candidato/'+id).send(req);
    res.send(resposta);
});

app.get('/testeDeleteCandidato/:id', async (req,res)=>{
    const {id} = req.params;
    var resposta = await unirest.delete('http://localhost:8081/api/candidato/'+id);
    res.send(resposta);
});

app.get('/testeGetCandidatos', async (req,res)=>{
    var resposta = await unirest.get('http://localhost:8081/api/candidato');
    res.send(resposta);
});

app.get('/testeGetCandidato/:id', async (req,res)=>{
    const {id} = req.params;
    var resposta = await unirest.get('http://localhost:8081/api/candidato/'+id);
    res.send(resposta);
});

app.get('/testePostIntencaoVoto', async (req,res)=>{
    var resposta = await unirest.post('http://localhost:8081/api/intencaovoto').send(req);
    res.send(resposta);
});

app.get('/testePostIntencaoVoto2', async (req,res)=>{
    var resposta = await unirest.post('http://localhost:8081/api/intencaovoto')
    .send(req);
    res.send(resposta);
});

app.get('/testeGetResultados', async (req,res)=>{
    var resposta = await unirest.get('http://localhost:8081/api/resultados').send(req);
    res.send(resposta);
})

app.listen(3000, function(){ console.log("Servidor no http://localhost:3000")});