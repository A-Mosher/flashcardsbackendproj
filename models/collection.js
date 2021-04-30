const mongoose = require('mongoose');
const { cardSchema } = require('./models/card');

const collectionSchema = new mongoose.Schema({
    title: { type: cardSchema, required: true },

});

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;