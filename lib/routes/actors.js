const router = require('express').Router();
const Actor = require('../models/actor');


module.exports = router
    .get('/', (req, res, next) => {
        Actor.find()
            .lean()
            .select('-dob -pob')
            .then(actor => res.json(actor))
            .catch(next);
    })
    .post('/', (req, res, next) => {
        Actor.create(req.body)
            .then(actor => res.json(actor))
            .catch(next);
    })
    .put('/:id', (req, res, next) => {
        Actor.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
            .then(actor => res.json(actor))
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        Actor.findByIdAndRemove(req.params.id)
            .then(actor => res.json({ removed: !!actor }))
            .catch(next);
    });