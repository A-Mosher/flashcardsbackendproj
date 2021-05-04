const mongoose = require('mongoose');
const Joi = require('joi');

const cardSchema = new mongoose.Schema({
    category: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
});


const Card = mongoose.model('Card', cardSchema);

function validateCard(card) {
    const schema = Joi.object({
        category: Joi.string().required(),
        question: Joi.string().required(),
        answer: Joi.string().required(),
    });
    return schema.validate(card);
}

exports.cardSchema = cardSchema;
exports.Card = Card;
exports.validateCard = validateCard;
