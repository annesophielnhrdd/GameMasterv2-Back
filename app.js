require('dotenv').config();
require('./models/connection');

import express, { json, urlencoded } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import { usersRouter, storiesRouter } from './routes';

const app = express();
const cors = require('cors');

app.use(cors());

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/stories', storiesRouter);

export default app;
