const express = require('express');
const exphs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const nconf = require('nconf').file({ 'file': 'config.json' }).env();
const connectionString = nconf.get('CUSTOMCONNSTR_MONGOLAB_URI');
const controllers = require('./controllers/index.js');
const personSchema = require('./model/person');
const app = express();
const print = require('./middlewares/printBody.js');

app.use(bodyParser.raw({limit: '100mb'}));

// Connect to the database.
mongoose.connect(connectionString);

// If the Node process ends, close the Mongoose connection.
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoose connection error:'));
db.once('openuri', function () {
  console.log("we're connected!");
});

var Person = mongoose.model('Person', personSchema);

app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',
exphs({
  extname: 'hbs',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  defaultLayout: 'main'
})
);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(controllers);

app.set('port', process.env.PORT || 4000);

module.exports = app;
