const {Router} = require("express");
const passport = require('passport')

const {isLogged, isNotLogged} = require('../util/auth')

const router = Router();

router.get('/', isNotLogged, (req, res)=>{
    res.render('auth/login', {layout: false});
});



router.post('/', (req, res, next)=>{
    passport.authenticate('local.login', {
        successRedirect: '/index',
        failureRedirect: '/ingreso',
        failureFlash: true
     })(req, res, next) 
});

router.get('/registro', isNotLogged, (req, res)=>{
    res.render('auth/registro', {layout: false});
});

router.post('/registro',(req, res, next)=>{
    passport.authenticate('local.signup', {
       successRedirect: '/ingreso',
       failureRedirect: '/registro',
       failureFlash: true
    })(req, res, next)
 });

 router.get('/cerrar_sesion', isLogged, (req, res)=>{
    req.logOut((err)=>{
        if (err) {
            console.log(err);
        }
    });
    res.redirect('/ingreso');
 });

module.exports = router