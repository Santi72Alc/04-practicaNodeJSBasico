'use strict';

const mongoose = require('mongoose');
const Articles = require('../models/Articles');


// Creamos algunos ejemplos del modelo 'Articles'
// return: array de articles
function makeExamples() {
    try {
        // Model Article
        const articles = [];
        const examples = require('../lib/articles.json');       // JSON de ejemplo
        let cont = 0;
        examples.forEach( (article) => {
            Articles.create( parseDocument(article), (err, docum ) => {
                if (err) {
                    console.log('Error saving the example', err);
                }
                else {
                    articles.push(docum);
                    cont++;
                    console.log(`Example saved #${cont}`)
                }
            })
        })
    } catch (error) {
        console.log(error);
    }
   
    // for (let i=0; i<examples.length; i++) {
    // }
    return articles;
}


// Parsea los datos del documento leídos a un 'Articulo'
function parseDocument( document ) {
    let data = new Articles( {
        name: (document.name).trim(),
        sale: document.sale === true ? true : false,
        price: +(document.price),
        picture: (document.picture).trim(),
        tags: document.tags
    });
    return data;
}


/**
 * Función principal
 */
function main() {
    try {
        // let cont = 0;
        let articles = [];
        let cnn = require('../lib/dbConnection');
        cnn.once('open', () => {
            require('../models/Articles');
            console.log("Deleting BD...");
            mongoose.connection.dropDatabase();         // Borramos la BD
            
            articles = makeExamples();          // Grabamos los ejemplos
            setTimeout(() => {
                console.log(`Examples created #${articles.length}`);
                console.log('Terminado!!');
                cnn.close();
            }, 400);
        });
    } catch (err) {
        console.log('Error reading the BD : ', err);
    }
}


// Ejecutamos la func. principal
main();
