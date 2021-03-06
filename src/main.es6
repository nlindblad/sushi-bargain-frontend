import "material-design-lite"


require("!style!css!sass!./main.sass");

import Lookup from 'modules/lookup'
import Location from 'modules/location'
import View from 'modules/view'

var shopTemplate = require('./templates/shop.hbs');

let data = require("json!./../sushi-data-optimised.json");

// Default to current date/time and browser provided location
var now = new Date();
var location = new Location(data.geo_hash.precision);

let lookup = new Lookup(data, now);

let view = new View();

let shopsWithSaleSoon = lookup.saleWithinNextHours(6);

document.addEventListener("DOMContentLoaded", function(event) {
    location.getRelevantGeoHashesForLocation(4).then(nearbyGeoHashes => {
        let nearbyShops = lookup.nearby(nearbyGeoHashes);
        let relevantShops = lookup.intersection(nearbyShops, shopsWithSaleSoon);
        relevantShops.forEach((i, j) => {
            let shopInformation = lookup.detailsForShop(i);
            let distance = location.distanceToShop(shopInformation);
            relevantShops[j] = Object.assign(shopInformation, { distance: distance });
        });
        relevantShops.sort(function (a, b) {
          return a.time_until_sale - b.time_until_sale || a.distance - b.distance;
        });
        relevantShops.forEach(shop => view.addToList(shopTemplate(shop)));
        view.donePopulating();
    });
});
