const {Card, validateCard} = require('../models/card');
const {Collection, validateCollection} = require('../models/collection');
const express = require('express');
const { response } = require('express');
const router = express.Router();

//collections functionality

router.get('/', async (req, res) => {
    try {
        const collections = await Collection.find();
        return res.send(collections);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.get('/:id', async (req, res) => {
    try {

        const collection = await Collection.findById(req.params.id);

        if (!collection)
            return res.status(400).send(`The collection with id "${req.params.id}" does not exist.`);

        return res.send(collection);

    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.post('/', async (req, res) => {
    try {
        const {error} = validateCollection(req.body);
        if (error)
            return res.status(400).send(error);

        const collection = new Collection({
            title: req.body.title,

        });

        await collection.save();

        return res.send(collection);

    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});


//cards functionality
// router.get('/', async (req, res) => {
//     try {
//         const flashcards = await Card.find();
//         return res.send(flashcards);
//     }   catch (ex) {
//         return res.status(500).send(`Internal Server Error: ${ex}`);
//     }
// });

//Get one card from a collection
router.get('/:collectionid/:cardid', async (req, res) => {
    try {
        //query for collection
        //query for specific card in that collection's cards array
        const collection = await Collection.findById(req.params.collectionid);

        if (!collection)
            return res.status(400).send(`The collection with id "${req.params.collectionid}" does not exist.`);

        const card = collection.cards.id(req.params.cardid);

        if (!card)
            return res.status(400).send(`The card with id "${req.params.cardid}" does not exist.`);

        return res.send(card);

    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});


router.post('/:collectionid/:cards', async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.collectionid);
        if (!collection) return res.status(400).send(`The collection with id "${req.params.collectionid}" does not exist.`);

        const card = await Card.findById(req.params.cardid);
        if (!card) return res.status(400).send(`The card with id "${req.params.cardid}" does not exist.`);

        const {error} = validateCard(req.body);
        if (error)
            return res.status(400).send(error);

        card = new Card({
            category: req.body.category,
            question: req.body.question,
            answer: req.body.answer,
        });

        collection.cards.push(card);
        await collection.save();

        return res.send(collection.cards);

    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.put('/:collectionid/cards/:cardid', async (req, res) => {
    try {

        const collection = await Collection.findById(req.params.collectionid);
        if (!collection) return res.status(400).send(`The collection with id "${req.params.collectionid}" does not exist.`);

        const card = await Card.findById(req.params.cardid);

        const {error} = validateCard(req.bod);
        if (error) return res.status(400).send (error);

        card = await Card.findByIdAndUpdate(req.params.id, {
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

router.delete('/:collectionid/cards/:cardid', async (req, res) => {
    try {

        const collection = await Collection.findById(req.params.collectionid);

        if (!collection)
            return res.status(400).send(`The collection with id "${req.params.collectionid}" does not exist.`);

        const card = collection.cards.id(req.params.cardid);
        if (!card) return res.status(400).send(`The card with id "${req.params.cardid}" does not exist.`);
        
        card = await card.remove();

        await collection.save();
        return res.send(card);

    }   catch(ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

module.exports = router;