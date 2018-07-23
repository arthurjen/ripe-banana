const router = require('express').Router();
const Actor = require('../models/actor');
const Film = require('../models/film');
const { HttpError } = require('../utils/errors');

const make404 = id => new HttpError({
    code: 404,
    message: `No actor with id ${id}`
});

module.exports = router
    .get('/', (req, res, next) => {
        Actor.find({}, 'name')
            .lean()
            .then(actor => res.json(actor))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Promise.all([
            Actor.findById(req.params.id)
                .lean()
                .select('-__v'),
            Film.find({ 'cast.actor': req.params.id }, 'title released')
                .lean()
        ])
            .then(([actor, films]) => {
                if(!actor) {
                    next(make404(req.params.id));
                }
                else {
                    actor.films = films;
                    res.json(actor);
                }
            })
            .catch(next);
    })
    .post('/', (req, res, next) => {
        if(req.body.length > 0) {
            Actor.insertMany(req.body)
                .then(actors => res.json(actors))
                .catch(next);
        }
        else Actor.create(req.body)
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
        Film.find({ 'cast.actor': req.params.id })
            .then(result => {
                if(result.length > 0) {
                    res.json({ removed: false });
                }
                else {
                    Actor.findByIdAndRemove(req.params.id)
                        .then(actor => res.json({ removed: !!actor }));
                }
            })
            .catch(next);
    });