var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {engine} = require('express-handlebars');
const dateFormat = require('handlebars-dateformat');
const session =require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport')
const flash = require('express-flash');

require('dotenv').config();
require('./util/passport');



var app = express();

// view engine setup
app.use(express.static(path.join(__dirname, 'public')));

app.engine('.hbs', engine({
    defaultLayout:'main',
    layoutsDir:path.join(app.get('views'), 'layouts'),
    partialsDir:path.join(app.get('views'), 'partials'),
    extname:'.hbs',
    helpers:require('./util/handlebars')
 }));
app.set('view engine', 'hbs');

app.use(session({
  secret:'session',
  resave:false,
  saveUninitialized: false,

  store: new MySQLStore({
     host: process.env.DB_HOST,
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     puerto: process.env.DB_PORT,
     database: process.env.DB_NAME
  })
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Global variables
app.use((req, res, next)=>{
  app.locals.user = req.user 
  next();
});

//importar rutas
//const muebleRouter = require('./routes/mueble');
//const carritoRouter = require('./routes/carrito');
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
//const comprasRouter = require('./routes/compras');
//const ventasRouter = require('./routes/ventas');
const productoRouter = require('./routes/producto');

//Rutas
app.use('/producto', productoRouter);
//app.use('/carrito', carritoRouter);
app.use('', authRouter);
app.use('/index', indexRouter);
//app.use('/compras', comprasRouter);
//app.use('/ventas', ventasRouter);

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
