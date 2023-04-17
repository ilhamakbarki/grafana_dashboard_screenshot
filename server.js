var express = require('express');
var bodyParser = require('body-parser');

// create express app
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// define a simple route
app.get('/', function(req, res){
    res.json({"message": "Grafana Dashboard Screenshot Capturing Automation"});
});

app.use('/screenshoot', express.static('screenshot'));

require('./app/routes/automation.routes.js')(app);

// listen for requests
global.PORT = process.env.PORT || 3001;
app.listen(global.PORT, function(){
    console.log(`Server is listening on port ${global.PORT}`);
});
