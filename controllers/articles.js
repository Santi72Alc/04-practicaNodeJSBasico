'use strict';

// const mongoose = require('mongoose');

const Articles = require('../models/Articles');
const TAGS = [ "work", "lifestyle", "motor", "mobile"] ;

// Devolvemos TODOS los artículosd de la BD
async function findAll( req, res, next ) {
    try {
        let cont = 0;
        console.log(`* Reading documents`);
        const articles = await Articles.list( {} );
        console.log(`Docs. readed : #${articles.length}`);
        articles.forEach(element => {
            cont++;
            console.log(`Doc. #${cont} id: ${element._id}`);
        }); 
        res.json( {success: true, result: articles});
    } catch (err) {
        console.log(`Error reading documents`);
        next(err);
    }
}


// Devolvemos los documentos filtrados por la query pasada
async function findFilter( req, res, next ) {
    try {
        // Recogemos los parámetros pasados
        const name = req.query.name;
        let sale = req.query.sale;
        let price  = req.query.price;
        let tags = req.query.tags;
        const filter = {};
        const skip = req.query.skip;
        const limit = req.query.limit;
        const fields = req.query.fields;
        const sort = req.query.sort;

        // Param. para crear el filtro
        if (name) { filter.name = name; };

        // Filtro de sale (puede ser true or false)
        if (sale) { 
            sale = sale.toLowerCase()
            if (["true", "false"].includes(sale)) {
                filter.sale = sale; 
            };
        };

        // Preparamos el filtro del precio
        if (price) { 
            let myObjFiltroPrice = {};
            price = price.split("-");
            // Sólo hemos pasado un precio para el filtro
            if (price.length == 1) { filter.price = price[0]; }
            else {
                // Hay comparación de precios
                console.log('Long: ', price.length);
                console.log('price :', price);
                if (price.length == 2) {
                    if (price[0] === '') { myObjFiltroPrice['$lte'] = price[1]; }       // -price
                    else {
                        if (price[1] === '') { myObjFiltroPrice['$gte'] = price[0]; }   // price-
                        else { 
                            myObjFiltroPrice['$gte'] = price[1];                        // priceA-priceB
                            myObjFiltroPrice['$lte'] = price[2];
                        }
                    }   
                }
                console.log('Filtro price : ', myObjFiltroPrice);
                filter.price = myObjFiltroPrice;
            }
        }

        // Comprobamos las etiquetas buscadas
        if (tags) { 
            tags = tags.toLowerCase().split(" ");
            console.log(tags);
            filter.tags = tags
        };
        
        let cont = 0;
        console.log(filter);
        console.log(`* Reading documents`);
        // Los controles de los parámetros se hacen en la función del modelo
        const articles = await Articles.list( { filter, limit, skip, fields, sort } );
        console.log(`Docs. readed : #${articles.length}`);
        articles.forEach(element => {
            cont++;
            console.log(`Doc. #${cont} id: ${element._id}`);
        }); 
        res.json( {success: true, result: articles});
        return;
    } catch (err) {
        console.log(`Error reading documents`, err);
        next(err);
    }
}



// Encontramos 1 articulo por Id
async function findById( req, res, next ) {
    try {
        console.log(`* Looking for document`);
        const _id = req.params.id;
        const article = await Articles.findById(_id).exec();
        if (!article) {
            res.status(404).json({ success: false });
            return;
        }
        console.log(`Document found - id: ${_id}`);
            res.json({ success: true, result: article });
        
    } catch (err) {
        console.log(`Error looking for document - id: ${_id}`);
        next (err);
    }
}


// Encontramos 1 articulo por Id
async function modifyId( req, res, next ) {
    try {
        console.log(`* Modifying document`);
        const _id = req.params.id;
        const data = req.body;
        const articleSaved = await Articles.findOneAndUpdate( {_id: _id}, data, { new: true, useFindAndModify:true }).exec();
        // new: true --> hace que el metodo devuelva el registro grabado
        console.log(`Document saved - id: ${articleSaved._id}`);
        res.json( { success: true, result: articleSaved } );
        return;

    } catch (err) {
        console.log(`Error saving document - id: ${_id}`);
        next( err );
    }
}


// Añadimos el articulo pasado por 'body'
async function add( req, res, next ) {
    try {
        console.log(`* Adding document`);
        let data = parseDocument( req.body );
        const document = new Articles(data);

        const articleSaved = await document.save();
        console.log(`Document add - id: ${articleSaved._id}`);
        res.json({ success: true, result: articleSaved });
        return;

    } catch (err) {
        console.log('Error adding document - id: ${_id}');
        next(err);
    }
}


async function deleteId( req, res, next ) {
    const _id = req.params.id;
    try {
        console.log(`* Deleting document`);
        const article = await Articles.deleteOne( { _id: _id }).exec();
        if (article && article.deletedCount > 0) {
            console.log(`Document deleted: ${_id}`);
            res.json( { success: true, result: article });
        }
        else {
            console.log(`Document NO deleted - id: ${_id}`);
            res.json({ success: false });
        }
    } catch (err) {
        console.log(`Error deleting document - id: ${_id}`);
        next( err );
    }
}


// Parsea los datos del documento leídos a un 'Articulo'
function parseDocument( document ) {
    let data = new Articles( {
        name: (document.name).trim(),
        sale: ["true", "false"].includes(document.sale) ? document.sale : false,
        price: parseFloat(document.price),
        picture: (document.picture).trim(),
        tags: []
    });
    // Comprobamos que tenga las etiquetas correctas
    for(let i=0; i<document.tags.length; i++) {
        console.log(document.tags[i]);
        if (TAGS.includes(document.tags[i])) {
            data.tags.push(document.tags[i]);
        }
    }
    return data;
}




// Exportamos los módulos
module.exports = {
    findAll,
    findFilter,
    findById,
    modifyId,
    add,
    deleteId
}