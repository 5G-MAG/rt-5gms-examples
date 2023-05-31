var express = require('express');
var router = express.Router();

const sai = {
    4: {
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
        clientMetricsReportingConfigurations: [
            {
                metricReportingConfigurationId: 1,
                serverAddresses: [
                    'http://192.168.178.78'
                ],
                scheme: "urn:5gmag:exoplayer:combined",
                dataNetworkName: "tbd",
                reportingInterval: "10",
                samplePercentage: 100.0,
                urlFilters: [],
                metrics: []
            },
            {
                metricReportingConfigurationId: 1,
                serverAddresses: [
                    'http://192.168.178.78'
                ],
                scheme: "urn:5gmag:exoplayer:unsupported",
                dataNetworkName: "tbd",
                reportingInterval: "10",
                samplePercentage: 100.0,
                urlFilters: [],
                metrics: []
            }]
    },
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