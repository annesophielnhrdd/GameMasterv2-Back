import { Router } from 'express';
import { User } from '../models';
import { checkBody } from '../modules';

const router = Router();
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

/* SignUp new user. */
router.post('/signup', (req, res) => {});

/* SignIp existing user. */
router.post('/signin', (req, res) => {});

export default router;
