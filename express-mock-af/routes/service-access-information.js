var express = require('express');
var router = express.Router();

const sai = {
    5: {
        provisioningSessionId: 5,
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
        clientMetricsReportingConfigurations: [
            {
                metricsReportingConfigurationId: "metrics-id-5",
                serverAddresses: [
                    'http://192.168.178.78:3003/3gpp-m5/v2/',
                    //'http://10.147.67.10'
                ],
                scheme: "urn:3GPP:ns:PSS:DASH:QM10",
                dataNetworkName: "tbd",
                reportingInterval: 10,
                samplePercentage: 100.0,
                urlFilters: [],
                metrics: []
            }]
    },
    4: {
        provisioningSessionId: 4,
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
                metricsReportingConfigurationId: "metrics-id-4",
                serverAddresses: [
                    'http://192.168.178.78:3003/3gpp-m5/v2/',
                    //'http://10.147.67.10'
                ],
                scheme: "urn:3GPP:ns:PSS:DASH:QM10",
                dataNetworkName: "tbd",
                reportingInterval: 10,
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