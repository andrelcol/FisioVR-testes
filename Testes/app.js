const express = require("express");

const app = express();

const path = require('path');
const router = express.Router();

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
})

app.get("/paciente", function(req, res){
  res.send("Paciente");
})

app.get("/profissional",function(req,res){
  res.sendFile(__dirname + "/profissional.html")
})

app.listen(3000, function(req, res){
  console.log("Servidor fucionando");
})

/*const http = require('http');

const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
*/
/*
const express = require('express');

const app = express();

const path = require('path');
const router =  express.Router();

router.get('/', function(req, res){

  res.sendFile(__dirtname + '/paciente.html');


});


app.use('/', router);

app.listen(process.env.port || 3000);
*/