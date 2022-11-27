const express = require('express');
const controllerAPI = require('../controllers/controllerAPI');
const route = express.Router();

module.exports = route;

//ControllerAPI
route.post("/api/candidato", controllerAPI.cadastrarCandidato);
route.put("/api/candidato/:id", controllerAPI.editarCandidato);
route.delete("/api/candidato/:id", controllerAPI.deletarCandidato);
route.get("/api/candidato", controllerAPI.getCandidatos);
route.get("/api/resultados", controllerAPI.getResultados);
route.post("/api/intencaovoto", controllerAPI.registrarVoto);
route.delete("/api/intencaovoto", controllerAPI.deletarVoto);