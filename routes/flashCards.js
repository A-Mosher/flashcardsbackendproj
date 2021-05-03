const {Card, validate} = require('../models/card');
//npmconst {Collection, validate} = require('../models/collection')
const express = require('express');
const { response } = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const flashcards = await Card.find();
        return res.send(flashcards);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.get('/:id', async (req, res) => {
    try {

        const card = await Card.findById(req.params.id);

        if (!card)
            return res.status(400).send(`The card with id "${req.params.id}" does not exist.`);

        return res.send(card);

    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.post('/', async (req, res) => {
    try {
        const {error} = validate(req.body);
        if (error)
            return res.status(400).send(error);

        const card = new Card({
            category: req.body.category,
            question: req.body.question,
            answer: req.body.answer,
        });

        await card.save();

        return res.send(card);

    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const {error} = validate(req.bod);
        if (error) return res.status(400).send (error);

        const card = await Card.findByIdAndUpdate(req.params.id, {
            category: req.body.category,
            question: req.body.question,
            answer: req.body.answer,
        },
        { new: true }
        );

        if (!card)
            return res.status(400).send(`The card with id "${req.params.id}" does not exist.`);

        await card.save();

        return res.send(card);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        
        const card = await Card.findByIdAndRemove(req.params.id);

        if (!card)
            return res.status(400).send(`The card with id "${req.params.id}" does not exist.`);
         
        return res.send(card);

    }   catch(ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

module.exports = router;