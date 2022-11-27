const express = require('express');
const controllerAPI = require('../controllers/controllerAPI');
const route = express.Router();

module.exports = route;

route.get("/",(req,res)=>{res.sendFile(path.join(__dirname + 'public/index.html'))});