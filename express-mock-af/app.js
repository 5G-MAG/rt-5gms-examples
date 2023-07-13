var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var xmlparser = require('express-xml-bodyparser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var saiRouter = require('./routes/service-access-information');
var metricsRouter = require('./routes/metrics-reporting');
var m8Router = require('./routes/m8');

var app = express();

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(xmlparser());
app.use(function (req, res, next) {
    console.log(req.headers)
    next()
})
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/3gpp-m5/v2/service-access-information', saiRouter )
app.use('/3gpp-m5/v2/metrics-reporting', metricsRouter )
app.use('/m8/', m8Router )

module.exports = app;
