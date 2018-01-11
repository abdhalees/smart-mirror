const LUISClient = require('../services/luis_sdk');
const nconf = require('nconf').file({ 'file': 'config.json' }).env();
const APPID = nconf.get('LUIS_APP_ID');
const APPKEY = nconf.get('LUIS_APP_KEY');
const request = require('request');

module.exports = (req, res, next) => {
  const {spokenText} = req.body;
  console.log(spokenText);
  if (spokenText === '') res.json({message: 'no speech'});
  else {
  var LUISclient = LUISClient({
    appId: APPID,
    appKey: APPKEY,
    verbose: true
  });

  LUISclient.predict(`${spokenText}`, {
    onSuccess: function (response) {
      let intent = response.topScoringIntent.intent 
      if(intent === 'joke') {
        getJoke(joke=>{
          res.json({message:joke})
        })
      } else if (intent === 'Greating') {
        res.json(({message:'Hello, How can I help you?'}))
      } else if (intent === 'Weather'){
        currentWeather(({description,temp})=>{
          console.log(description)
          res.json({message:`It is ${description} and the temprature is ${temp}`});
        })
      } else {
        res.json({message: 'no speech'});        
      }
    },
    onFailure: function (err) {
      console.log(err);
      res.send('error');
    }
  });
}
}


const getJoke = cb =>{
request.get({url:'https://icanhazdadjoke.com/',headers:{Accept:'application/json'}},(err,response,body)=>{
if(err) console.log(err);
else cb(JSON.parse(body).joke)
})
}

function currentWeather(cb) {
  var url = `http://api.openweathermap.org/data/2.5/weather?q=gaza&appid=4f40fa8cc23309f4e16f95790befd866`;

  request(url , function(err, response, body) {
    console.log(err);
    var fullData=JSON.parse(body);
    var data = {description :fullData.weather[0].description,
                temp:parseInt(toCelsius(fullData.main.temp))}
    cb(data);
  });
}

function toCelsius(kelvin){
  return (kelvin - 273.15).toFixed(2);
}