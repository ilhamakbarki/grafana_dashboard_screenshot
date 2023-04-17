module.exports = function (app) {


    var grafana = require('../controllers/grafana.controller.js');

    app.post('/grafana', grafana.capture);

}
