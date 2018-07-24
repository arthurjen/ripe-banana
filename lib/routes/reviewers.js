const Router = require('koa-router');
const router = new Router();
const Reviewer = require('../models/reviewer');
const Review = require('../models/review');
// const { HttpError } = require('../utils/errors');

// const make404 = id => new HttpError({
//     code: 404,
//     message: `No reviewer with id ${id}`
// });

module.exports = router
    .get('/', async ctx => {
        return Reviewer.find({}, '-__v')
            .lean()
            .then(reviewers => ctx.body = reviewers);
    })
    .get('/:id', async ctx => {
        return Promise.all([
            Reviewer.findById(ctx.params.id, '-__v')
                .lean(),
            Review.find({ reviewer: ctx.params.id }, 'rating review film')
                .lean()
                .populate('film', 'title')
        ])
            .then(([reviewer, reviews]) => {
                // if(!reviewer) {
                //     next(make404(req.params.id));
                // }
                // else {
                reviewer.reviews = reviews;
                ctx.body = reviewer;
                // }
            });
    })

    .post('/', async ctx => {
        if(ctx.request.body.length > 0) {
            return Reviewer.insertMany(ctx.request.body)
                .then(reviewers => ctx.body = reviewers);
        }
        else return Reviewer.create(ctx.request.body)
            .then(reviewer => ctx.body = reviewer);
    })

    .put('/:id', async ctx => {
        return Reviewer.findByIdAndUpdate(
            ctx.params.id,
            ctx.request.body,
            {
                new: true,
                runValidators: true
            }
        )
            .then(reviewer => ctx.body = reviewer);
    });