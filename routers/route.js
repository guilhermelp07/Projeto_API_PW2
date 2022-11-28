const express = require('express');
const controllerAPI = require('../controllers/controllerAPI');
const route = express.Router();
const path = require('path');

module.exports = route;

route.get("/", (req,res)=>{res.sendFile(path.join(__dirname + 'public/index.html'))})

//ControllerAPI
route.post("/api/candidato", controllerAPI.cadastrarCandidato);
route.put("/api/candidato/:id", controllerAPI.editarCandidato);
route.delete("/api/candidato/:id", controllerAPI.deletarCandidato);
route.get("/api/candidato", controllerAPI.getCandidatos);
route.get("/api/candidato/:id", controllerAPI.getCandidatoById);
route.get("/api/resultados", controllerAPI.getResultados);
route.post("/api/intencaovoto", controllerAPI.registrarVoto);
route.delete("/api/intencaovoto", controllerAPI.deletarVoto);