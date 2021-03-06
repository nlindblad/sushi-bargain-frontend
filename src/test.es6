const assert = require('assert');

import Lookup from 'modules/lookup'
import Location from 'modules/location'

function generateTestData() {
    let testData = {
        "time_slot_lookup": [],
        "geo_hash": {
            "lookup": {},
            "precision": 7
        },
        "shops": [
            {
                "position": {"lat": 51.5, "lng": -0.1},
                "post_code": "XYZ123",
                "name": "Sushi shop 1",
                "half_price_times": [18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0],
                "address": "MayFair, London"
            },
            {
                "position": {"lat": 51.52, "lng": -0.12},
                "post_code": "XYZ456",
                "name": "Sushi shop 2",
                "half_price_times": [18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0],
                "address": "MayFair, London"
            },
            {
                "position": {"lat": 51.53, "lng": -0.13},
                "post_code": "XYZ789",
                "name": "Sushi shop 3",
                "half_price_times": [18.5, 18.5, 18.5, 18.5, 18.5, 18.5, 18.5],
                "address": "MayFair, London"
            }
        ]
    }

    // Initialise empty time slots
    for (var timeSlot = 0; timeSlot < 336; timeSlot++) {
        testData["time_slot_lookup"].push([]);
    }

    return testData;
}

describe('lookup', function () {

    it('looks up time slots correctly', () => {
        let testData = generateTestData();
        testData["time_slot_lookup"][84] = [1, 2, 3];
        testData["time_slot_lookup"][85] = [4, 5];
        testData["time_slot_lookup"][86] = [6];
        testData["time_slot_lookup"][87] = [7];
        testData["time_slot_lookup"][88] = [8];

        let lookup = new Lookup(testData, new Date("October 6, 2016 11:13:00"));

        let expected = new Set([1, 2, 3, 4, 5, 6, 7]);
        let actual = lookup.saleWithinPeriod(84, 3);
        assert.deepStrictEqual(Array.from(actual), Array.from(expected));
    })

    it('generates map links for coordinates correctly', () => {
        let testData = generateTestData();
        let lookup = new Lookup(testData, new Date("October 6, 2016 11:13:00"));
        let mapUrl = lookup.generateMapLink(51.507496, -0.158340,);

        assert.equal(mapUrl, "https://www.google.com/maps/dir/?api=1&destination=51.507496,-0.15834");
    })
})

describe('location', function () {

    it('calculates distance correctly', () => {
        let location = new Location(7);
        var expected = 929;
        var actual = Math.round(location.distanceBetween(58.3838, .30412, 50.0359, 0.5425));
        assert.equal(expected, actual);

        var expected = 1.7;
        var actual = Math.round(location.distanceBetween(51.507496, -0.158340, 51.506149, -0.142756) * 10) / 10;
        assert.equal(expected, actual);
    })

    it('calculates nearby geohashes for different zoom levels correctly', () => {
        let location = new Location(7);
        let relevantGeoHashes = location.getRelevantGeoHashes("gcpvh2s", 3);

        let expected = {
            '0': [ 'gcpvh2s', 'gcpvh2u', 'gcpvh2v', 'gcpvh2t', 'gcpvh2m', 'gcpvh2k', 'gcpvh27', 'gcpvh2e', 'gcpvh2g' ],
            '1': [ 'gcpvh2', 'gcpvh3', 'gcpvh9', 'gcpvh8', 'gcpuux', 'gcpuur', 'gcpuup', 'gcpvh0', 'gcpvh1' ],
            '2': [ 'gcpvh', 'gcpvk', 'gcpvm', 'gcpvj', 'gcpuv', 'gcpuu', 'gcpug', 'gcpv5', 'gcpv7' ]
        }

        assert.deepStrictEqual(relevantGeoHashes, expected);
    })
})
