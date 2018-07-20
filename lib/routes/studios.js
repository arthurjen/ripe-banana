const router = require('express').Router();
const Studio = require('../models/studio');

module.exports = router
    .get('/', (req, res, next) => {
        Studio.find()
            .lean()
            .select('name')
            .then(studio => res.json(studio))
            .catch(next);
    })
    .post('/', (req, res, next) => {
        Studio.create(req.body)
            .then(studio => res.json(studio))
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        Studio.findByIdAndRemove(req.params.id)
            .then(studio => res.json({ removed: !!studio }))
            .catch(next);
    });