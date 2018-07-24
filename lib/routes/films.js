const Router = require('koa-router');
const router = new Router();
const Film = require('../models/film');
const Review = require('../models/review');
// const { HttpError } = require('../utils/errors');

// const make404 = id => new HttpError({
//     code: 404,
//     message: `No film with id ${id}`
// });

module.exports = router
    .get('/', async ctx => {
        return Film.find({}, '-cast -__v')
            .lean()
            .populate('studio', 'name')
            .then(films => ctx.body = films);
    })

    .get('/:id', async ctx => {
        return Promise.all([
            Film.findById(ctx.params.id, '-__v')
                .lean()
                .populate('studio', 'name')
                .populate('cast.actor', 'name'),
            Review.find({ film: ctx.params.id }, 'id rating review reviewer')
                .lean()
                .populate('reviewer', 'name')
        ])
            .then(([film, reviews]) => {
                // if(!film) {
                //     next(make404(req.params.id));
                // }
                // else {
                film.reviews = reviews;
                ctx.body = film;
                // }
            });
    })

    .post('/', async ctx => {
        if(ctx.request.body.length > 0) {
            return Film.insertMany(ctx.request.body)
                .then(films => ctx.body = films);
        }
        else return Film.create(ctx.request.body)
            .then(film => ctx.body = film);
    })
    
    .delete('/:id', async ctx => {
        return Film.findByIdAndRemove(ctx.params.id)
            .then(film => ctx.body = { removed: !!film });
    });
    