const {Card, validateCard} = require('../models/card');
const {Collection, validateCollection} = require('../models/collection');
const express = require('express');
const router = express.Router();


//get all collections
router.get('/', async (req, res) => {
    try {
        const collections = await Collection.find();
        return res.send(collections);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//get collection by id
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

//post a new collection
router.post('/', async (req, res) => {
    try {
        const {error} = validateCollection(req.body);
        if (error)
            return res.status(400).send(error);

        const collection = new Collection({
            title: req.body.title,
            cards: req.body.title

        });

        await collection.save();

        return res.send(collection);

    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//update a collection
router.put('/:id', async (req, res) => {
    try {

        const collection = await Collection.findById(req.params.collectionid);
        if (!collection) return res.status(400).send(`The collection with id "${req.params.collectionid}" does not exist.`);

        const {error} = validateCollection(req.body);
        if (error)
            return res.status(400).send(error);

        collection = await Collection.findByIdAndUpdate(req.params.collectionid, {
            title: req.body.title,
            cards: req.body.cards
        },
        {new: true},
        );
        if (!collection)
            return res.status(400).send(`The collection with id "${req.params.id}" does not exist.`);

        await collection.save();

        return res.send(collection);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//delete a collection
router.delete('/:id', async (req, res) => {
    try {

        const collection = await Collection.findById(req.params.collectionid);

        if (!collection)
            return res.status(400).send(`The collection with id "${req.params.collectionid}" does not exist.`);
        
        collection = await collection.remove();

        await collection.save();
        return res.send(collection);

    }   catch(ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//get all cards linked to a collection's id ***************************************************************************************************
router.get('/:collectionid/cards', async (req, res) => {
    try {
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

//Get one specific card from a collection
router.get('/:collectionid/:cardid', async (req, res) => {
    try {
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

//post a new card to a collection
router.post('/:collectionid/cards', async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.collectionid);
        if (!collection) return res.status(400).send(`The collection with id "${req.params.collectionid}" does not exist.`);

        const {error} = validateCard(req.body);
        if (error)
            return res.status(400).send(error);

        const card = new Card({
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

//update a specific card in a collection
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

//delete a card from a collection
router.delete('/:collectionid/cards/:cardid', async (req, res) => {
    try {

        const collection = await Collection.findById(req.params.collectionid);

        if (!collection)
            return res.status(400).send(`The collection with id "${req.params.collectionid}" does not exist.`);

        let card = collection.cards.id(req.params.cardid);
        if (!card) return res.status(400).send(`The card with id "${req.params.cardid}" does not exist.`);
        
        card = await card.remove();

        await collection.save();
        return res.send(card);

    }   catch(ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

module.exports = router;