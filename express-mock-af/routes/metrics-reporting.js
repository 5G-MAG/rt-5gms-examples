var express = require('express');
var router = express.Router();

router.post('/:provisioningSessionId/:metricsReportingConfigurationId', function (req, res, next) {
    console.log(`MetricsReporting: `, req.body)
    res.send(204);
});

module.exports = router;
