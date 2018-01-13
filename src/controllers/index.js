const express = require('express');
const createProfile = require('./createProfile.js');
const verifyFace = require('./verifyFace');
const home = require('./home');
const voiceControl = require('./voiceControl');
const router = express.Router();

router.get('/', home.get);
router.post('/create', createProfile);
router.post('/verify', verifyFace);
router.post('/voice', voiceControl);

module.exports = router;
