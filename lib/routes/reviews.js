const Router = require('koa-router');
const router = new Router();
const Review = require('../models/review');


module.exports = router
    .get('/', async ctx => {
        return Review.find({}, 'rating review film')
            .lean()
            .limit(100)
            .populate('film', 'title')
            .then(review => ctx.body = review);
    })

    .post('/', async ctx => {
        if(ctx.request.body.length > 0) {
            return Review.insertMany(ctx.request.body)
                .then(reviewers => ctx.body = reviewers);
        }
        else return Review.create(ctx.request.body)
            .then(review => ctx.body = review);
    });