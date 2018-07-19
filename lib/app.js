const express = require('express');
const app = express();
const morgan = require('morgan');

const path = require('path');
const publicDir = path.resolve(__dirname, '../public');
app.use(morgan('dev'));
app.use(express.static(publicDir));
app.use(express.json());

//don't forget to change thing:
// const thing = require('./routes/thing');
// app.use('/api/things', thing);

module.exports = app;