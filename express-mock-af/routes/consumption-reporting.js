var express = require('express');
var router = express.Router();

router.post('/:provisioningSessionId', function(req, res, next) {
  console.log(`ConsumptionReporting: `, req.body)
  res.send(204);
});

module.exports = router;
