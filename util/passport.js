const passport = require('passport')
const localStrategy = require('passport-local').Strategy

const pool = require('../bin/database')


const helpers = require('./helpers');

passport.use('local.login', new localStrategy({
    usernameField: 'usuario',
    passwordField: 'contrasena',
    passReqToCallback: true
}, async (req, usuario, contrasena, done) => {
    try {
        let consulta = await pool.query('SELECT * FROM Usuario WHERE usuario = ?', [usuario]);
        if (consulta.length > 0) {
            let user = consulta;
            let validPassword = await helpers.matchPassword(contrasena, user[0][0].contrasena);
            if (validPassword) {
                // Autenticación exitosa
                return done(null, user[0][0]);  // No es necesario el tercer argumento
            } else {
                // Contraseña incorrecta
                return done(null, false, { message: 'Contraseña Incorrecta' });
            }
        } else {
            // Usuario no existe
            return done(null, false, { message: 'El usuario no existe' });
        }
    } catch (error) {
        return done(error);
    }
}));


passport.use('local.signup', new localStrategy({
    usernameField: 'usuario',
    passwordField: 'contrasena',
    passReqToCallback: true
 }, async(req, usuario, contrasena, done) => {
     let {DNI, nombres, apellidos, email} = req.body;
 
     const newUser = {
        usuario,
        contrasena
     };
     newUser.contrasena = await helpers.encryptPassword(contrasena);
 
     let connection;
     
     try {
         connection = await pool.getConnection();
         await connection.beginTransaction();
 
         const [resultUsuario] = await connection.query('INSERT INTO Usuario SET ?', [newUser]);
        

         const newPersona = {
             DNI,
             nombres,
             apellidos,
             email,
             usuario,
         };
 
         await connection.query('INSERT INTO Persona SET ?', [newPersona]);
 
         await connection.commit();
         return done(null, newUser);
     } catch (error) {
         if (connection) {
             await connection.rollback();
         }
         return done(error);
     } finally {
         if (connection) {
             connection.release();
         }
     }
 }));

passport.serializeUser((usr, done)=>{
   done(null, usr.usuario)
})

passport.deserializeUser((async(id, done)=>{
   const rows = await pool.query('SELECT U.usuario, DNI, nombres, apellidos, email, RUC, rol FROM Persona P inner join Usuario U on P.usuario = U.usuario  WHERE U.usuario = ?', [id])
   done(null, rows[0][0])
}))
