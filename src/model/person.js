const mongoose = require('mongoose');

module.exports = mongoose.Schema({
  'name': String,
  'email': String,
  'face_id': String,
  'stock': String,
  'homeAddress': String,
  'stockTo': String
});
