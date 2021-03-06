var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var mongoose = require('mongoose');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Conexión a la BD
 */
require('./lib/dbConnection');
require('./models/Articles');

app.use((req, res, next) => {
  // una de 2 cosas:
  //  - Responder 
  // res.send("Ok");
  //  - Llamar a next
  // Si da error Cannot set headers after they are sent to the client
  // es porque se ha respondido 2 veces 
  next();
});


/**
 * Configuración de variables generales
 */
// Ponemos el nombre de la aplicación en 'app'
app.locals.titleApp = "myShop";



/*
 * Rutas de mi página principal
 */
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// Página articles_ver1  (/apiv1)
app.use('/apiv1', require('./routes/articles_ver1'));



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // Chequeamos el error de validación
  if (err.array) {  // Es un error de validación (porque es tipo array)
    err.status = 422;
    const errInfo = err.array({onlyFirstError: true})[0];
    err.message = isAPI() ?
      {message: "Not valid", erros: err.mapped()} :
      `Not valid - ${errInfo.param} ${errInfo.msg}`
  }

  res.status(err.status || 500);

  if (isAPI(req)) {
    res.json({success: false, error: err.message});
    return;
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error', {err});
});


function isAPI(req) {
  return req.originalUrl.indexOf('/apiv') === 0;
}



module.exports = app;
