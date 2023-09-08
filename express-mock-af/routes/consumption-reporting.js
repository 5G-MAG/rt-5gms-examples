var express = require('express');
var router = express.Router();

var querystring = require('querystring');
var querystring = require('body-parser');

/* GET users listing. */
router.post('/:aspId', function(req, res, next) {
  const aspId = req.params.aspId;
  res.send("respond a resource for consumption-reporting with post for aspId:" + aspId);
  
  res.send(204);
});

module.exports = router;