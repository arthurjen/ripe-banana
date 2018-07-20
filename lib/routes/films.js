const router = require('express').Router();
const Film = require('../models/film');


module.exports = router
    .get('/', (req, res, next) => {
        Film.find()
            .lean()
            .select('-cast -__v')
            .populate({
                path: 'studio',
                select: 'name'
            })
            .then(films => res.json(films))
            .catch(next);
    })
    .post('/', (req, res, next) => {
        Film.create(req.body)
            .then(film => res.json(film))
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        Film.findByIdAndRemove(req.params.id)
            .then(film => res.json({ removed: !!film }))
            .catch(next);
    });
    