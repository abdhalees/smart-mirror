const mongoose = require('mongoose');
const formidable = require('formidable');
const request = require('request');
const nconf = require('nconf').file({ 'file': 'config.json' }).env();
const oxfordList = 'test_face_list';
const oxfordKey = nconf.get('OXFORD_SECRET_KEY');
module.exports = (req, res, next) => {
  var Person = mongoose.model('Person');

  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log(err);
    } else {
      var person = new Person(fields);
      person.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log(fields.face_id);
          request.post({
            'url': 'https://eastasia.api.cognitive.microsoft.com/face/v1.0/facelists/' + oxfordList + '/persistedFaces',
            'headers': {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': oxfordKey
            },
            'body': JSON.stringify({
              'url': fields.face_id
            })
          },
              function (err, response, body) {
                console.log('response', response.statusCode);
                console.log('body', body);
                body = JSON.parse(body);
                if (err) {
                  console.log(err);
                } else {
                  var model = mongoose.model('Person');
                  model.update({ '_id': person._id }, {$set: { face_id: body.persistedFaceId }}, function (err, user) {
                    if (err) {
                      console.log(err);
                      res.send('Please try again.');
                    }

                    res.send('Success');
                  });
                }
              });
        }
      });
    }
  });
};
