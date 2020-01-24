'use strict';

var express = require('express');
var router = express.Router();

const Articles = require('../models/Articles');

// Controladores de Articulos
const ctrls = require('../controllers/articles');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('indexWEB');
});


/**
 * Para versiones de DEMO WEB
 */
// Para la ventanta principal del CRUD
router.get('/crud', async function(req, res, next) {
    const consult = await Articles.list({});
    res.render('crudArticles', { result: consult });
});

// Filtrado de artículos
router.post('/crud/filter', async function(req, res, next) {
    console.log(req.body);
    let filter = {};
    let limit, skip, fields, sort;
    if (req.body.limit) { let limit = req.body.limit };
    if (req.body.skip) { skip = req.body.skip };
    if (req.body.fields) { fields = req.body.fields };
    if (req.body.sort) { sort = req.body.sort };

    if (req.body.filter) { filter = { "filter": req.body.filter + "=" + req.body.txtfilter } };

    console.log("filtro = ", filter);
    const consult = await Articles.list({ filter, limit, skip, fields, sort });
    res.render('crudArticles', { result: consult });
});


// Para añadir el registro
router.post('/crud/add', async function(req, res, next) {
    ctrls.add(req, res, next);
    res.redirect('/crud');
});

// Para borrar el registro
router.get('/crud/delete/:id', async function(req, res, next) {
    const { id } = req.params;
    await Articles.deleteOne({ _id: id }).exec();
    res.redirect('/crud');
})


// Para ver el registro
router.get('/crud/view/:id', async function(req, res, next) {
    const { id } = req.params;
    const consult = await Articles.list({ filter: { _id: id } });
    res.render('viewArticle', { result: consult });
})





module.exports = router;