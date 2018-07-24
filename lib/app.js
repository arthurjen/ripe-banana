const Koa = require('koa');
const app = new Koa();

// const morgan = require('morgan');
// app.use(morgan('dev'));

app.use(async(ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = 400;
        ctx.body = `Uh-oh: ${err.message}`;
        console.log('Error handler:', err.message);
    }
});


const bodyParser = require('koa-json-body');
app.use(bodyParser());

const Router = require('koa-router');
const router = new Router();


const studios = require('./routes/studios');
router.use('/api/studios', studios.routes(), studios.allowedMethods());

const reviewers = require('./routes/reviewers');
router.use('/api/reviewers', reviewers.routes(), reviewers.allowedMethods());

const actors = require('./routes/actors');
router.use('/api/actors', actors.routes(), actors.allowedMethods());

const films = require('./routes/films');
router.use('/api/films', films.routes(), films.allowedMethods());

const reviews = require('./routes/reviews');
router.use('/api/reviews', reviews.routes(), reviews.allowedMethods());


app.use(router.routes());
module.exports = app;