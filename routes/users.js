var express = require('express');
var router = express.Router();
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const Story = require('../models/Story');
const User = require('../models/User');

/* SignUp new user. */
router.post('/signup', (req, res) => {});

/* SignIp existing user. */
router.post('/signin', (req, res) => {});

module.exports = router;
