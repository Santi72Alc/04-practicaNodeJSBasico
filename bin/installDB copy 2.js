'use strict';

// const mongoose = require('mongoose');
const Articles = require('../models/Articles');


// Read the examples
const readExamples = async () => {
    return await require('../lib/articles.json');
}



// Create the elements
const createArticles = async ( documents ) => {
    let articles = [];
    let article;
    let artSaved;
    for (const document of documents) {
        try {
            article = Articles.parseDocument( document );
            artSaved = await Articles.create( article );
            articles.push( artSaved );
        } catch (error) {
            console.error(`Error creating article :\n${article}\n${error}`);
        }
    }
    return articles;
}


/**
 * Función principal
 */

// Creamos la función asíncrona y ejecutamos  ()()
( async () => {
    try {
        let cnn = require('../lib/dbConnection');
        cnn.once('open', async _ => {
            console.log("Deleting BD...");
            cnn.dropDatabase();             // Borramos la BD
            console.log('Deleted!!');
            console.log("Reading examples...");
            const examples = await readExamples();              // Leemos los ejemplos
            console.log("Done!");
            // ---> Hasta aquí funciona!!!
            console.log("Saving articles...");
            const articles = await createArticles( examples );        // Grabamos los ejemplos
            console.log("Done!");

            // Crea los articulos pero no hace el await
            // SIGUE inmediatamente por estas dos líneas y no hace el await
            console.log(`Artículos creados #${articles.length}`);
            console.log('Terminado!!');
            cnn.close();     
        });
    } catch (err) {
        console.log('Error: ', err);
    }
})();

