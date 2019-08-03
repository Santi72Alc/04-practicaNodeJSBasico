'use strict';

var express = require('express');
var router = express.Router();

// Controladores de Articulos
const ctrls = require('../controllers/articles');


// GET      -- Recoge el contenido de TODOS los documentos existentes
router.get('/all', ctrls.findAll);

// GET      -- Recoge el contenido filtrado por un query
router.get('/', ctrls.findFilter);

// GET One  -- Recoge el contenido del documento solicitado con key _id = 'id'
router.get('/:id', ctrls.findById);

// PUT One  -- Modifica el contenido del documento solicitado con key _id = 'id'
router.put('/:id', ctrls.modifyId);

// POST One -- Crea el documento
router.post('/add', ctrls.add);

// DELETE One -- Borra el documento solicitado con key _id = 'id'
router.delete('/:id', ctrls.deleteId);



module.exports = router;