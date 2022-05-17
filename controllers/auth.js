const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const async = require("hbs/lib/async");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.login = async (req, res) => {
    try {
        const { user, password } = req.body;

        if( !user || !password ) {
            return res.status(400).render('login', {
                message: 'Usuário ou senha incorretos!'
            })
        }

    } catch(error) {
        console.log(error);
    }
}

exports.register = (req, res) => {
    console.log(req.body);

    const { user, password, passwordConfirm } = req.body;

    db.query('SELECT login FROM usu WHERE login = ?', [user], async (error, results) => {
        if(error) {
            console.log(error);
        }

        if(results.length > 0) {
            return res.render('cadastro', {
                message: 'Usuario pronto'
            })
        } else if(password !== passwordConfirm) {
            return res.render('cadastro', {
                message: 'Senhas diferentes'
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO usu SET ?', {login: user, senha: password }, (error, results) => {
            if(error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('cadastro', {
                    message: 'Usuário Cadastrado'
                })
            }
        })

    });



}