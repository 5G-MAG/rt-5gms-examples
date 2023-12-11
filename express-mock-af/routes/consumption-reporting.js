var express = require('express');
var router = express.Router();

router.post('/:provisioningSessionId', function(req, res, next) {
  res.send(204);
});

module.exports = router;
