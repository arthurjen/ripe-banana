const router = require('express').Router();
const Reviewer = require('../models/reviewer');


module.exports = router
    .get('/', (req, res, next) => {
        Reviewer.find({}, '-__v')
            .lean()
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })
    .post('/', (req, res, next) => {
        Reviewer.create(req.body)
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })
    .put('/:id', (req, res, next) => {
        Reviewer.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
            .then(reviewer => res.json(reviewer))
            .catch(next);
    });