const Router = require('koa-router');
const router = new Router();
const Actor = require('../models/actor');
const Film = require('../models/film');
// const { HttpError } = require('../utils/errors');

// const make404 = id => new HttpError({
//     code: 404,
//     message: `No actor with id ${id}`
// });

module.exports = router
    .get('/', async ctx => {
        return Actor.find({}, 'name')
            .lean()
            .then(actor => ctx.body = actor);
    })

    .get('/:id', async ctx => {
        return Promise.all([
            Actor.findById(ctx.params.id)
                .lean()
                .select('-__v'),
            Film.find({ 'cast.actor': ctx.params.id }, 'title released')
                .lean()
        ])
            .then(([actor, films]) => {
                // if(!actor) {
                //     next(make404(req.params.id));
                // }
                // else {
                actor.films = films;
                ctx.body = actor;
                // }
            });
    })

    .post('/', async ctx => {
        if(ctx.request.body.length > 0) {
            return Actor.insertMany(ctx.request.body)
                .then(actors => ctx.body = actors);
        }
        else return Actor.create(ctx.request.body)
            .then(actor => ctx.body = actor);
    })

    .put('/:id', async ctx => {
        return Actor.findByIdAndUpdate(
            ctx.params.id,
            ctx.request.body,
            {
                new: true,
                runValidators: true
            }
        )
            .then(actor => ctx.body = actor);
    })

    .delete('/:id', async ctx => {
        return Film.find({ 'cast.actor': ctx.params.id })
            .then(result => {
                if(result.length > 0) {
                    ctx.body = { removed: false };
                }
                else {
                    return Actor.findByIdAndRemove(ctx.params.id)
                        .then(actor => ctx.body = { removed: !!actor });
                }
            });
    });