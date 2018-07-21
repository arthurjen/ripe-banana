const router = require('express').Router();
const Review = require('../models/review');


module.exports = router
    .get('/', (req, res, next) => {
        Review.find({}, 'rating review film')
            .lean()
            .limit(100)
            .populate('film', 'title')
            .then(review => res.json(review))
            .catch(next);
    })
    .post('/', (req, res, next) => {
        Review.create(req.body)
            .then(review => res.json(review))
            .catch(next);
    });