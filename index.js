/**
 * @author 		: Shubham Verma
 * @createdon	: 2019-09-18
 * @requires	: path, configs/global, configs/app, baseApp
 * @exports		: BaseAppClass, which can be used to create an object of the class and find the list of all eligible customers,
 * the respective business logic and code flow for which has been explained in the BaseAppClass
 *
 * @description	: This is the main touch point for the whole project, the script file which has been defined as the "main" file in package.json
 * It requires all the major("read initial") class files required for the project and initializes the playground for this small application.
 *
 * Configurations Explainations : There are two level of configurations in the application.
 * a. Global level configurations : Like, showUnhandledExceptions : useful in debug mode to determine whether the app would show unhandled
 * 		exceptions or not, these configurations cannot be over-rided from outside of the application
 * b. Application level configurations : Like, filePath: the path for source file, distanceUnit: the units of the distance to be calculated,
 * 		these configurations can be overrided from outside the application, using the options argument of "getEligibleCustomers" function
 * 		of the BaseAppClass.
 *
 * The complete description for the configs can be found in the respective files as well.
 *
 * @generalconventions	: Below are some general conventions for the project, which have been followed while writing the application:
 * a. The complete architecture of the application is highly flexible, configurable, scalable and dynamic in nature, some of which may seem an
 * 		overkill for the situation, but that's how enterprise level applications should be.
 * b. "_" (underscore) before any property/method in all of the classes, denotes that these are internal properties which means that these
 * 		cannot be called/changed from outside the application, cannot be over-ridden by child-classes if there are.
 * 		NOTE : the properties could have been sealed or frozen, but that would again be an overkill, I guess.
 * c. "Configurations" (both global and app level) are scalable and can be easily extended in the future if need be.
 */

// required to set up the projectFolderPath in "global" object, which would be used in the rest of the application hereafter
var path = require('path');
global.projectFolderPath = path.resolve();

// required to set up the global level configurations
const globalConfigs = require('./configs/global');
global.configs = globalConfigs;

// required to set up the application level configurations, which are being set on the Constructor/Class definition of BaseAppClass and would
// be extracted from the constructor itself.
const appConfigs = require('./configs/app');
const BaseAppClass = require('./baseApp');
BaseAppClass.configs = appConfigs;

global.B2C = new BaseAppClass();
B2C.getEligibleCustomers({distance: 200}).catch((err) => {
	console.log(`Error received: `, err.message);
}).then((eligibleCustomers) => {
	console.log(eligibleCustomers);
});

module.exports = BaseAppClass;