const mysql = require('mysql');
const connection = mysql.createConnection({
	host: 'fisiovr@200.131.17.17',
	port: 11062,
	user: 'root',
	password: 'Teste',
	database:'BD_teste'
});

connection.connect(function(err){
 if(err) return console.log(err); 
 console.log('conectou!');
 });
