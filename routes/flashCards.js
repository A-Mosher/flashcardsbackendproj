const {Card} = require('../models/card');
const {Collection} = require('../models/collection')
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
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

module.exports = router;