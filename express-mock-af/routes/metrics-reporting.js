var express = require('express');
var router = express.Router();

router.post('/:provisioningSessionId/:metricsReportingConfigurationId', function (req, res, next) {
    const provisioningSessionId = req.params.provisioningSessionId;
    const metricsReportingConfigurationId = req.params.metricsReportingConfigurationId
    const metricsReport = req.rawBody

    console.log(metricsReport)
    res.send(200)
});


module.exports = router;