'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const http = require('http');
var path = require('path');

// App



const app = express()
const PORT = 8080;
const HOST = '0.0.0.0';

app.set('views', path.join(__dirname, 'views'));
app.set('port', PORT);
app.use(bodyParser.json());
app.use(multer());
// app.listen(PORT, HOST);
// console.log(`Running on http://${HOST}:${PORT}`);
const routes = require('./routes');

app.use('/', routes.default);
app.use('/fulfillment', routes.fulfillment);


const server = http.createServer(app)
server.listen(app.get('port'), function(){
  console.log('Express server listening on port' + app.get('port'))
});