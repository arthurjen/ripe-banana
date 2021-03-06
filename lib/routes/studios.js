const Router = require('koa-router');
const router = new Router();
const Studio = require('../models/studio');
const Film = require('../models/film');
// const { HttpError } = require('../utils/errors');

// const make404 = id => new HttpError({
//     code: 404,
//     message: `No studio with id ${id}`
// });

module.exports = router
    .get('/', async ctx => {
        return Studio.find({}, 'name')
            .lean()
            .then(studio => {
                ctx.body = studio;
            });
    })
    .get('/:id', async ctx => {
        return Promise.all([
            Studio.findById(ctx.params.id, '-__v')
                .lean(),
            Film.find({ studio: ctx.params.id }, 'title')
                .lean()
        ])
            .then(([studio, films]) => {
                // if(!studio) {
                //     next(make404(req.params.id));
                // }
                // else {
                studio.films = films;
                ctx.body = studio;
                // }
            });
    })

    .post('/', async ctx => {
        if(ctx.request.body.length > 0) {
            return Studio.insertMany(ctx.request.body)
                .then(studios => ctx.body = studios);
        }
        else return Studio.create(ctx.request.body)
            .then(studio => ctx.body = studio);
    })

    .delete('/:id', async ctx => {
        return Film.find({ studio: ctx.params.id })
            .then(result => {
                if(result.length > 0) {
                    ctx.body = { removed: false };
                }
                else {
                    return Studio.findByIdAndRemove(ctx.params.id)
                        .then(studio => ctx.body = { removed: !!studio });
                }
            });
    });