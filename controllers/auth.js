const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const async = require("hbs/lib/async");
const { promisify } = require("util")

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.login = async (req, res) => {

    try {
        const { user, password } = req.body;
        console.log(password);
        if( !user || !password ) {
            return res.status(400).render('login', {
                message: 'Informe um usuário e uma senha!'
            })
        }

        db.query('SELECT * FROM usu WHERE login = ?', [user], async (error, results) => {
            console.log(results);
            //bcrypt.compare(password, results[0].password)
            if( !results /*|| !password.compare(results[0].password)*/ ) {
                res.status(401).render('login', {
                    message: 'usuario ou senha incorretos'
                });
            } else {
                const id = results[0].id;

                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("Token: " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/");
            }
        });
    } catch (error) {
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

exports.isLoggedIn = async (req, res, next) => {
    //  console.log(req.cookies);
    if(req.cookies.jwt) {
        try {
            //verifica o token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET
                );
            console.log(decoded);
            //verifca se o usuario existe
            db.query('SELECT * FROM usu WHERE id = ?', [decoded.id], (error, result) => {
                console.log(result);

                if(!result) {
                    return next();
                }

                req.usuario = result[0];
                return next();
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    }
    next();
}