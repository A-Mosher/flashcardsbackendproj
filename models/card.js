const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    category: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
});


const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
