const express = require('express');
const createProfile = require('./createProfile.js');
const verifyFace = require('./verifyFace');
const home = require('./home');
const router = express.Router();

router.get('/', home.get);
router.post('/create', createProfile);
router.post('/verify', verifyFace);

module.exports = router;
