'use strict';

var express = require('express');
var router = express.Router();

const Articles = require('../models/Articles');

// Controladores de Articulos
const ctrls = require('../controllers/articles');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('indexWEB');
});


/**
 * Para versiones de DEMO WEB
 */
// Para la ventanta principal del CRUD
router.get('/crud', async function (req, res, next) {
  console.log(req.body);
  const consult = await Articles.list({});
  res.render('crudArticles', { result: consult });
});


// Para añadir el registro
router.post('/crud/add', async function (req, res, next) {
  ctrls.add(req, res, next);
  res.redirect('/crud');
});

// Para borrar el registro
router.get('/crud/delete/:id', async function(req, res, next) {
  const { id } =  req.params;
  await Articles.deleteOne({ _id: id }).exec();
  res.redirect('/crud');
})


// Para ver el registro
router.get('/crud/view/:id', async function(req, res, next) {
  const { id } =  req.params;
  const consult = await Articles.list({ filter:{_id: id} });
  res.render('viewArticle', { result: consult } );
})



// Para el filtro
router.get('/crud/view', async function (req, res, next) {
  let limit = (req.body.limit) ? req.body.limit : null;
  let skip = (req.body.skip) ? req.body.skip : null;
  let fields = (req.body.fields) ? req.body.fields : null;
  let sort = (req.body.sort) ? req.body.sort : null;
  let filter = (req.body.filter) ? { "filter": req.body.name + req.body.txtName } : null;
  // let limit;
  // let skip;
  // let fields;
  // let sort;
  console.log(req.body);
  const consult = await Articles.list({ filter, limit, skip, fields, sort });
  res.redirect('/crud');
});


// Para la visata de uno
router.get('/crud/view/:id', async function (req, res, next) {
  let id = req.params.id;

  console.log(req.params);
  const consult = await Articles.list({ _id: id} );
  res.redirect('/crud');
});



// router.get('/crud/add', async function ( req, res, next) {
//   const body = req.body;
//   console.log("adding: ", body);
// });


module.exports = router;