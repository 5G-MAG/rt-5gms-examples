var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var saiRouter = require('./routes/service-access-information');
var m8Router = require('./routes/m8');
var consumptionReportingRouter = require('./routes/consumption-reporting');
var metricsReportingRouter = require('./routes/metrics-reporting');

var app = express();

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
//app.use(bodyParser.xml());
app.use(bodyParser.text({ type: 'application/xml' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/3gpp-m5/v2/service-access-information', saiRouter )
app.use('/m8/', m8Router )
app.use('/3gpp-m5/v2/consumption-reporting', consumptionReportingRouter )
app.use('/3gpp-m5/v2/metrics-reporting', metricsReportingRouter )

module.exports = app;
