'use strict';

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
        min:0.0,
        max: 99999.0
    },
    picture: String,
    tags: {
        type: [String],
        enum: ['work', 'lifestyle', 'motor', 'mobile']
    }
});


ArticleSchema.statics.list = function( { filter, start, limit, skip, fields, sort }) {
    const query = Article.find( filter );
    // if (start) { query.start( start ); };        // NO la encuentro en la documentación (asumo que es 'skip')
    if (limit) { query.limit( parseInt(limit) ); };
    if (skip) { query.skip( parseInt(skip) ); };
    query.select( fields );
    if (sort) { query.sort( sort ); };
    return query.exec();
}


const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;