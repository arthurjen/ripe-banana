const Koa = require('koa');
const app = new Koa();

// const morgan = require('morgan');
// app.use(morgan('dev'));




const bodyParser = require('koa-json-body');
app.use(bodyParser());

const Router = require('koa-router');
const router = new Router();


const studios = require('./routes/studios');
router.use('/api/studios', studios.routes(), studios.allowedMethods());

// const reviewers = require('./routes/reviewers');
// app.use('/api/reviewers', reviewers);
// const actors = require('./routes/actors');
// app.use('/api/actors', actors);
const films = require('./routes/films');
router.use('/api/films', films.routes(), films.allowedMethods());

// const reviews = require('./routes/reviews');
// app.use('/api/reviews', reviews);

app.use(router.routes());
module.exports = app;