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
 * Para versiones futuras de DEMO WEB
 */
router.get('/crud', async function (req, res, next) {
  const consult = await Articles.list({});
  res.render('crudArticles', { result: consult });
});

router.post('/crud/add', async function (req, res, next) {
  ctrls.add(req, res, next);
  res.redirect('/crud');
});

router.delete('crud/delete/:id', async function(req, res, next) {
  const id =  req.params.id;
  await Articles.remove( { _id: id });
  res.redirect('/crud');
})




// router.get('/crud/add', async function ( req, res, next) {
//   const body = req.body;
//   console.log("adding: ", body);
// });


module.exports = router;