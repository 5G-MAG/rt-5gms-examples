var express = require('express');
const Utils = require('../utils/Utils');
var router = express.Router();

router.post('/:provisioningSessionId/:metricsReportingConfigurationId', function (req, res, next) {
    const payload = req.body
    const path = `public/reports/${req.params.provisioningSessionId}/metrics_reports/${req.params.metricsReportingConfigurationId}/${new Date().toISOString()}.xml`

    Utils.writeToDisk(path, payload)
    res.send(204);
});

module.exports = router;
