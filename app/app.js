var express = require('express');
var app = express();
var path = require('path');

var staticPath = path.join(__dirname, 'static');
console.log(staticPath);

app.use('/static', express.static(staticPath));

app.listen(3000);