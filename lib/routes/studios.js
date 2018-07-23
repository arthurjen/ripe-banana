const router = require('express').Router();
const Studio = require('../models/studio');
const Film = require('../models/film');
const { HttpError } = require('../utils/errors');

const make404 = id => new HttpError({
    code: 404,
    message: `No studio with id ${id}`
});

module.exports = router
    .get('/', (req, res, next) => {
        Studio.find({}, 'name')
            .lean()
            .then(studio => res.json(studio))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Promise.all([
            Studio.findById(req.params.id, '-__v')
                .lean(),
            Film.find({ studio: req.params.id }, 'title')
                .lean()
        ])
            .then(([studio, films]) => {
                if(!studio) {
                    next(make404(req.params.id));
                }
                else {
                    studio.films = films;
                    res.json(studio);
                }
            })
            .catch(next);
    })
    .post('/', (req, res, next) => {
        if(req.body.length > 0) {
            Studio.insertMany(req.body)
                .then(studios => res.json(studios))
                .catch(next);
        }
        else Studio.create(req.body)
            .then(studio => res.json(studio))
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        Studio.findByIdAndRemove(req.params.id)
            .then(studio => res.json({ removed: !!studio }))
            .catch(next);
    });