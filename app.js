var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

//var requestChecker  =   require('./routes/middleware');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//app.use(requestChecker)

var freezers = require('./routes/freezers');
app.use('/freezers', freezers);


app.set('port', (process.env.PORT || 3002));
app.listen(app.get('port'), function () {
    console.log('Server has started! http://localhost:' + app.get('port') + '/');
});
module.exports = app;