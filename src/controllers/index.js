const express = require('express');
const createProfile = require('./createProfile.js');
const verifyFace = require('./verifyFace');

const router = express.Router();

router.post('/create', createProfile);
router.post('/verify', verifyFace);

module.exports = router;
