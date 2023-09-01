var express = require('express');
var router = express.Router();

const sai = {
    3: {
        provisioningSessionId: 3,
        provisioningSessionType: 'DOWNLINK'
    },
    2: {
        provisioningSessionId: 2,
        provisioningSessionType: 'DOWNLINK',
        streamingAccess: {
            entryPoints: [
                {
                    locator: 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd',
                    contentType: 'application/dash+xml',
                    profiles: [
                        'urn:mpeg:dash:profile:isoff-live:2011'
                    ]
                }
            ]
        },
        clientConsumptionReportingConfiguration: {
            serverAddresses: ['http://10.64.15.112:3003/3gpp-m5/v2/'],
            locationReporting: false,
            samplePercentage: 60,
            reportingInterval: 10,
            accessReporting: true
        }
    },
    1: {
        provisioningSessionId: 1,
        provisioningSessionType: 'DOWNLINK',
        streamingAccess: {
            entryPoints: [
                {
                    locator: 'https://livesim.dashif.org/livesim/testpic_2s/Manifest.mpd',
                    contentType: 'application/dash+xml',
                    profiles: [
                        'urn:mpeg:dash:profile:isoff-live:2011'
                    ]
                }
            ]
        }
    }
}

/* GET users listing. */
router.get('/:provisioningSessionId', function (req, res, next) {
    const id = req.params.provisioningSessionId;
    res.json(sai[id])
});

module.exports = router;