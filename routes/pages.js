const express = require("express");
const authController = require('../controllers/auth')

const router = express.Router();

router.get('/', authController.isLoggedIn, (req, res) => {
    res.render('login', {
        user: req.usuario
    });
});

router.get('/cadastro', (req, res) => {
    res.render('cadastro');
});

router.get('/MeusPacientes', authController.isLoggedIn, (req, res) => {
    if( req.usuario && req.usuario.id_tipo_usuario == 2 ) {
        res.render('MeusPacientes', {
            user: req.usuario
        });
     }
});


router.get('/paciente', authController.isLoggedIn, (req, res) => {
    
    if( req.usuario && req.usuario.id_tipo_usuario == 3 ) {
        res.render('paciente', {
            user: req.usuario

        });
    } else {
        if(req.usuario) {
            res.render('profissional', {
                user: req.usuario
            });     
        }
        else {
            res.redirect('/login');    
        }
        
    }
    
});

router.get('/profissional', authController.isLoggedIn, (req, res) => {
    if( req.usuario && req.usuario.id_tipo_usuario == 2 ) {
        res.render('profissional', {
            user: req.usuario
        });
    } else {
        if(req.usuario) {
            res.render('paciente', {
                user: req.usuario
    
            }); 
        }
        else {
            res.redirect('/login');
        }
        
    }
    
});

/*router.get('/Teste', authController.isLoggedIn, (req, res) => {
    if( req.usuario ) {
        res.render('Teste', {
            user: req.usuario
        });
    } else {
        res.redirect('/login');
    }
    
});

*/

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/profile', authController.isLoggedIn, (req, res) => {
    if( req.usuario ) {
        res.render('profile', {
            user: req.usuario
        });
    } else {
        res.redirect('/login');
    }
    
});

router.get('/exercicios', authController.isLoggedIn, (req, res) => {
    if( req.usuario ) {
        res.render('../front/src/index.hbs', {
            user: req.usuario
        });
    } else {
        res.redirect('index');
    }
    
})

router.get('/profissionalProfile', authController.isLoggedIn, (req, res) => {
    if( req.usuario ) {
        res.render('profissionalProfile', {
            user: req.usuario
        });
    } else {
        res.redirect('index');
    }
    
})

module.exports = router;
