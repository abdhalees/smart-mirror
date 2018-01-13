const request = require('request');
const mongoose = require('mongoose');
const nconf = require('nconf').file({ 'file': 'config.json' }).env();
const oxfordKey = nconf.get('OXFORD_SECRET_KEY');
const oxfordList = 'test_face_list';
const minConfidence = 0.5;

module.exports = (req, res, next) => {
  console.log(req.body.length);
  request.post({
    'url': 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false',
    'headers': {
      'Content-Type': 'application/octet-stream',
      'Ocp-Apim-Subscription-Key': oxfordKey
    },
    'body': req.body
  },
  function(error, response, body) {
    body = JSON.parse(body);
    if (body.length > 0) {
      // There should only be one face, but in the event there are more,
      // the largest one is returned first.
      var faceId = body[0].faceId;
      // Specifying the face id and the faceList Id for Project Oxford's REST API's.
      var req = {
        'faceId': faceId,
        'faceListId': oxfordList,
        'maxNumOfCandidatesReturned': 1
      };
      console.log(faceId);
      // Interacts with Project Oxford to find a similar face in the face bank.
      findSimilarFaces(req, res);
    }
    else {
      var message = 'Unable to find a face in the picture.';
      if (body.error) {
        console.log(body.error);
        message = 'Error from project oxford';
      }
      res.write(JSON.stringify({
        'message': message,
        'authenticated': false
      }));
      res.end();
    }
  });
};

function findSimilarFaces (req, res) {
  request.post({
    'url': 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/findsimilars',
    'headers': {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': oxfordKey
    },
    'body': JSON.stringify(req)
  },
  function (error, response, body) {
    if (error) {
      console.log(error);
      res.write(JSON.stringify({
        'message': 'There was an error with authentication.',
        'authenticated': false
      }));
    } else {
      body = JSON.parse(body);
      console.log(body);
      if (body.length > 0) {
        var faceId = body[0].persistedFaceId;
        var confidence = body[0].confidence;
        var model = mongoose.model('Person');
        model.findOne({ 'face_id': faceId }, function (err, user) {
          if (err) {
            console.log(err);
            res.write(JSON.stringify({
              'message': 'There was an error with authentication.',
              'authenticated': false
            }));
          }
          if (user) {
            var message, percConf = confidence.toFixed(4) * 100;
            if (confidence >= minConfidence) {
                            res.send(JSON.stringify({
                'message': `Successfully logged in as ${user.name}! Confidence level was ${percConf}%.`,
                'authenticated': true,
                'name': user.name,
                'confidence': confidence,
                'stock': user.stock,
                'homeAddress': user.homeAddress,
                'stockTo': user.stockTo
              }));
            } else {
              res.send(JSON.stringify({
                'message': `Unable to find a strong enough match. Confidence level was ${percConf}%.`,
                'authenticated': false
              }));
            }
          } else {
            res.send(JSON.stringify({
              'message': 'Unable to find a database obj that matches the face id',
              'authenticated': false
            }));
          }
        });
      } else {
        res.send(JSON.stringify({
          'message': 'Unable to find a face in the provided picture',
          'authenticated': false
        }));
      }
    }
  });
}
