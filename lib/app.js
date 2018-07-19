const express = require('express');
const app = express();
const morgan = require('morgan');

const path = require('path');
const publicDir = path.resolve(__dirname, '../public');
app.use(morgan('dev'));
app.use(express.static(publicDir));
app.use(express.json());

//don't forget to change thing:
// const studio = require('./routes/studio');
// app.use('/api/studios', studio);

module.exports = app;