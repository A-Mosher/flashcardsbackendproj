const mongoose = require('mongoose');
const { collectionSchema } = require('./collection');

const cardSchema = new mongoose.Schema({
    category: { type: collectionSchema, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
});


const Card = mongoose.model('Card', cardSchema);
