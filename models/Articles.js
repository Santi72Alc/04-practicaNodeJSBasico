'use strict';

// tags allowed
const TAGS = ["work", "lifestyle", "motor", "mobile"];

const mongoose = require('mongoose');


var ArticleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sale: {
        type: Boolean,
        default: true
    },
    price: {
        type: Number,
        default: 0.0,
        min: 0.0,
        max: 99999.0
    },
    picture: String,
    tags: {
        type: [String],
        enum: ['work', 'lifestyle', 'motor', 'mobile']
    }
});


// List of articles with filter.. and differents options
ArticleSchema.statics.list = function({ filter, start, limit, skip, fields, sort }) {
    const query = Articles.find(filter);
    // if (start) { query.start( start ); };        // NO la encuentro en la documentación (asumo que es 'skip')
    if (limit) { query.limit(parseInt(limit)); };
    if (skip) { query.skip(parseInt(skip)); };
    query.select(fields);
    if (sort) { query.sort(sort); };
    return query.exec();
}


// Parsea los datos del documento leídos a un 'articulo'
ArticleSchema.statics.parseDocument = function( article ) {
    let articleParsed = new Articles({
        name: article.name.trim(),
        sale: ["true", "false"].includes(article.sale) ? article.sale : "false",
        price: parseFloat(article.price),
        picture: (article.picture).trim(),
        tags: []
    });
    // Comprobamos que tenga las etiquetas correctas
    for (let i = 0; i < article.tags.length; i++) {
        if (TAGS.includes(article.tags[i])) {
            articleParsed.tags.push(article.tags[i]);
        }
    }
    return articleParsed;
}



const Articles = mongoose.model('Articles', ArticleSchema);

module.exports = Articles;