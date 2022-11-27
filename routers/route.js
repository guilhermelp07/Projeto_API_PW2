const express = require('express');
const controllerAPI = require('../controllers/controllerAPI');
const controllerCandidato = require('../controllers/controllerCandidato');
const route = express.Router();

module.exports = route;

route.get("/",(req,res)=>{res.sendFile(path.join(__dirname + 'public/index.html'))});

//ControllerAPI
route.post("/api/candidato", controllerAPI.cadastrarCandidato);
route.put("/api/candidato/:id", controllerAPI.editarCandidato);
route.delete("/api/candidato/:id", controllerAPI.deletarCandidato);
route.get("/api/candidato", controllerAPI.getCandidatos);
route.get("api/candidato", controllerAPI.getResultados);

//ControllerCandidato
route.get("/candidatoCreate", controllerCandidato.getCandidatoCreate);
