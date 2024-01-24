module.exports = {
   isLogged(req, res, next){
      if(req.isAuthenticated()){
         return next()
      }
      //req.flash('alerta', 'Primero inicie sesion')
      return res.redirect('/')
   },

   isNotLogged(req, res, next){
      if(!req.isAuthenticated()){
         return next()
      }
      return res.redirect('/')
   },

   isAdmin(req, res, next){
      if(req.isAuthenticated() && req.user.rol == 'administrador'){

         return next()
      }
      //req.flash('alerta', 'Primero inicie sesion')
      return res.redirect('/index')
   },
   
}