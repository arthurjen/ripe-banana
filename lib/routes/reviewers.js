const router = require('express').Router();
const Reviewer = require('../models/reviewer');
const Review = require('../models/review');
const { HttpError } = require('../utils/errors');

const make404 = id => new HttpError({
    code: 404,
    message: `No reviewer with id ${id}`
});

module.exports = router
    .get('/', (req, res, next) => {
        Reviewer.find({}, '-__v')
            .lean()
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Promise.all([
            Reviewer.findById(req.params.id, '-__v')
                .lean(),
            Review.find({ reviewer: req.params.id }, 'rating review film')
                .lean()
                .populate('film', 'title')
        ])
            .then(([reviewer, reviews]) => {
                if(!reviewer) {
                    next(make404(req.params.id));
                }
                else {
                    reviewer.reviews = reviews;
                    res.json(reviewer);
                }
            })
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