'use strict';

// const mongoose = require('mongoose');
const Articles = require('../models/Articles');


// Read the examples
const readExamples = async () => {
    return await require('../lib/articles.json');
}



// Create the elements
const createArticles = async (documents) => {
    let cont = 0;
    let article;
    for (const document of documents) {
        try {
            article = Articles.parseDocument(document);
            await Articles.create(article);
            cont++;
        } catch (error) {
            console.error(`Error creating article :\n${error}`);
        }
    }
    return cont;
}


/**
 * Función principal
 */

// Creamos la función asíncrona y ejecutamos  ()()
(async () => {
    try {
        let cnn = require('../lib/dbConnection');
        cnn.once('open', async () => {
            console.log("Deleting BD...");
            cnn.dropDatabase();             // Borramos la BD
            console.log('Deleted!!');

            console.log("Reading examples...");
            const examples = await readExamples();              // Leemos los ejemplos
            console.log("Done!");

            console.log("Saving articles...");
            const numArticulos = await createArticles(examples);        // Grabamos los ejemplos
            console.log("Done!");

            console.log(`Artículos creados #${numArticulos}`);
            console.log('Terminado!!');
            cnn.close();
        });
    } catch (err) {
        console.log('Error: ', err);
    }
})();

