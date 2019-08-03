'use strict';

var express = require('express');
var router = express.Router();

const Articles = require('../models/Articles');

// Controladores de Articulos
const ctrls = require('../controllers/articles');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/info', function (req, res, next) {
  res.render('/README.md');
});

/**
 * Para versiones futuras de DEMO WEB
 */
// router.get('/crud', async function ( req, res, next) {
//   const consult = await Articles.list({});
//   console.log("Consulta: ", consult);
//   res.render('crudArticles', { result: consult });
// });

// router.get('/crud/add', async function ( req, res, next) {
//   const body = req.body;
//   console.log("adding: ", body);
// });


module.exports = router;
