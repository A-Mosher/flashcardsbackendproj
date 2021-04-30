const mongoose = require('mongoose');
const { cardSchema } = require('../models/card');
const Joi = require('joi');

const collectionSchema = new mongoose.Schema({
    title: { type: cardSchema, required: true },

});

const Collection = mongoose.model('Collection', collectionSchema);

function validateCollection(collection) {
    const schema = Joi.object({
        title: Joi.cardSchema().required(),
    });
    return schema.validate(collection);
}

exports.collectionSchema = collectionSchema;
exports.Collection = Collection;
exports.validate = validateCollection;