const mysql = require('mysql');
var express = require("express");
var app =  express();


const pool = mysql.createPool({
	host: '0.0.0.0',
	port: 3000,
	user: 'root',
	password: 'Teste',
	database:'BD_teste'
});

console.log("ok");
	
function createTable(conn){
 
      const sql = "create table teste("+
			"id_usuario int primary key not null,"+
			"nome varchar(60) not null,"+
			"cpf int not null"+
			");";

      conn.query(sql, function (err, results, fields){
          if(err) return console.log(err);
          console.log('criou a tabela!');
      });
}

pool.getConnection(function(err, connection) {
  // Use the connection
  createTable(pool);
  pool.query( 'SELECT * FROM usu', function(err, rows) {
    // And done with the connection.
   // connection.release();

    // Don't use the connection here, it has been returned to the pool.
   // console.log(rows['login']);
  });
});

/*app.get("/usuario", (req, res) => {
   pool.query("select * from usu", (err, results) => {
   	if (err) sendStatus(500).send(err);
   	else send(results);
   });
   
/*   });  */ 



