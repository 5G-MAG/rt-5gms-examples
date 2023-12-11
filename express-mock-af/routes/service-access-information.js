var express = require('express');
var router = express.Router();

//const baseUrl = 'http://192.168.178.78:3003';
const baseUrl = 'http://10.147.67.10:3003';
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
            serverAddresses: [`${baseUrl}/3gpp-m5/v2/`],
            locationReporting: true,
            samplePercentage: 99,
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
        },
        clientConsumptionReportingConfiguration: {
            serverAddresses: [`${baseUrl}/3gpp-m5/v2/`],
            locationReporting: true,
            samplePercentage: 100,
            reportingInterval: 10,
            accessReporting: true
        }
    }
}

/* GET users listing. */
router.get('/:provisioningSessionId', function (req, res, next) {
    const id = req.params.provisioningSessionId;
    res.setHeader('cache-control', 'max-age=5');
    res.setHeader('last-modified', Date.now());
    res.json(sai[id])
});

module.exports = router;
