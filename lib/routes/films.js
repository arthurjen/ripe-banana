const router = require('express').Router();
const Film = require('../models/film');


module.exports = router
    .get('/', (req, res, next) => {
        Film.find()
            .lean()
            .then(film => res.json(film))
            .catch(next);
    })
    .post('/', (req, res, next) => {
        Film.create(req.body)
            .then(film => res.json(film))
            .catch(next);
    })
    .put('/:id', (req, res, next) => {
        Film.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
            .then(film => res.json(film))
            .catch(next);
    });