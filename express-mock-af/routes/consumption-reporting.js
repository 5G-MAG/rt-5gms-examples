var express = require('express');
var router = express.Router();

var querystring = require('querystring');
var querystring = require('body-parser');


router.post('/:provisisioningSessionId', function(req, res, next) {
  const provisisioningSessionId = req.params.provisisioningSessionId;
  //res.send("respond a resource for consumption-reporting with post for provisisioningSessionId:" + provisisioningSessionId);
  
  res.send(204);
});

module.exports = router;