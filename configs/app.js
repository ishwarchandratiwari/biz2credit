/**
 * Configuration Description is as follows :
 * filePath : Complete path for the data source file to be read
 * sourceCoordinates : An object which stores the latitude and longitude for the source point, from where the customer distance isto be calculated.
 * distanceUnit : Possible Value: KM for kilometers, M for Miles.
 * distance : Distance in provided distanceUnits on basis of which customers would be filtered.
 * customerSortingField : The field on basis of which the customers list is to be filtered.
 * showErrorForFailedCustomerProcessing : It determines whether the code would throw error if there is processing error for any customer
 */
const path = require('path');
const APP_CONFIGS = {
	filePath : path.resolve(__dirname + '/../data/customers.txt'),
	sourceCoordinates : {
		latitude  : 53.339428,
		longitude : -6.257664
	},
	distanceUnit : "KM",
	distance : 100,
	customerSortingField: "user_id",
	sortingType : "ASC",
	showErrorForFailedCustomerProcessing : false
};
module.exports = APP_CONFIGS;