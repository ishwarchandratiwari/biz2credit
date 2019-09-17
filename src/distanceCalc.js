/**
 * @param {Number} sourceLatitude : Latitude of the source from which the distance is to be calculated
 * @param {Number} sourceLongitude : Longitude of the source from which the distance is to be calculated
 * @param {Number} destinationLatitude : Latitude of the destination to which the distance is to be calculated
 * @param {Number} destinationLongitude : Longitude of the destination to which the distance is to be calculated
 * @param {String} unit : Possible values KM for Kilometer, M for Miles
 *
 * @api 		: Distance Calculator
 * @author 		: Shubham Verma
 * @created 	: 2019-09-18
 *
 * @description : API to calculate distance between two-cordinates on earth.
 * @references	: Reference has been taken from https://www.movable-type.co.uk/scripts/latlong.html
 */
function distanceCalculator(sourceLatitude, sourceLongitude, destinationLatitude, destinationLongitude, unit = 'KM') {
	if ((sourceLatitude == destinationLatitude) && (sourceLongitude == destinationLongitude)) {
		return 0;
	} else {
		const earthRadius = 6371 * 1000;//Earth radius in KMS converted to Metres
		const radiansSrcLat = Math.PI * sourceLatitude / 180;
		const radiansDestLat = Math.PI * destinationLatitude / 180;
		const deltaLatRads = Math.PI * (destinationLatitude - sourceLatitude) / 180;
		const deltaLongRads = Math.PI * (destinationLongitude - sourceLongitude) / 180;

		//This is the square of half the chord length between the points.
		const cordLength = Math.sin(deltaLatRads/2) * Math.sin(deltaLatRads/2) +
        	Math.cos(radiansSrcLat) * Math.cos(radiansDestLat) * Math.sin(deltaLongRads/2) * Math.sin(deltaLongRads/2);

		//This is the angular distance in radians
		const angularDistanceRads = 2 * Math.atan2(Math.sqrt(cordLength), Math.sqrt(1-cordLength));

		let distance = earthRadius * angularDistanceRads;
		distance = distance/1000;
		if (unit == "M") { distance = distance / 1.609344 }
		return distance;
	}
}
module.exports = distanceCalculator;