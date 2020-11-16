require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');
const errorHandler = require('./errorHandler');

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(cors());
app.use(morgan(morganOption));
app.use(helmet());

// log in
app.use('/api/auth', authRouter);

// register only
app.use('/api/users', usersRouter);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(errorHandler);

module.exports = app;
