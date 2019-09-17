const { once } = require('events');
const readline = require('readline');
const fs = require('fs');
const AppError = require('./appError');
const distanceCalc = require('./distanceCalc');

/**
 * @class 		: AppError
 * @author 		: Shubham Verma
 * @created 	: 2019-09-18
 * @implements : fs, readfile, once, AppError
 * Below class implements "fs" & "readfile" module from node.js and an "Once" module provided in events class from node.js
 *
 * If need to look at references for the classes and functionality used, references have been provided below :
 * readline : https://nodejs.org/docs/latest/api/readline.html
 * fs : https://nodejs.org/docs/latest/api/fs.html
 * once : https://nodejs.org/docs/latest/api/events.html#events_events_once_emitter_name
 *
 * Custom Classes used :
 * AppError : App (Global) level error class, extended from Error class in javascript
 * to distinguish between handled exceptions vs unhandled exceptions
 *
 * @description : Created as a completely standalone, self-sufficient and highly configurable class definition
 * whose main function is to read a list of customers from a text file situated at default location or at the location passed
 * in over-writable options.
 */
class BaseApp {

	constructor() {
		this._initClassProps();
	}

	/**
	 * @description : used to initialize the class with defaults, it can be re-used in case we need to reset/re-initialize the class object
	 */
	_initClassProps() {
		this.customersList = [];
		this.eligCustomersList = [];
		this.configs = BaseApp.configs;
	}

	/**
	 * @param {Object} configs : A plain JS Object, which can be used to over-ride the default configuration provided to the class
	 * @description : The only exposed function of the class, which can be called from outside the class
	 * > Would throw an error if passed configs are not valid.
	 * > Extends the passed configs to the global configs for the class
	 * > Then calls the internal "_getEligibleCustomers" function to actually fetch the list of eligible customers.
	 * > The function would throw a specific error, only in case, an unhandled exception is received in fetching the eligible list.
	 */
	async getEligibleCustomers(configs = {}) {
		if (!(configs instanceof Object)) {
			this.throwError('Invalid configurations provided');
		}
		this.configs = { ...this.configs, ...configs };
		return await this._getEligibleCustomers().catch((err) => {
			this.throwError(`Error in getting eligibile customers list`, err);
		});
	}

	/**
	 * @description : Internal-Use function to actually fetch the list of eligible customers
	 * > Initializes the lineNumberCounter, readInterfaceErrorLine variable to 0
	 * > Calls the "_setupReaderInterface" function which would create the reader interface to read the file line by line, and parse the
	 * 		data for the respective customer and put it into "customersList" variable
	 * > Loop over all the "customersList" and process the data for each customer by calling "_processCustomerData" on each customer's data,
	 * 		to identify the eligible customers.
	 * > Calls "_sortEligibleCustomersList" function to sort the list of all "eligCustomersList"
	 * > return the final list of all eligible customers
	 */
	async _getEligibleCustomers() {
		this.lineNumberCounter = 0;
		this.readInterfaceErrorLine = 0;
		await this._setupReaderInterface();
		for (const customerData of this.customersList) {
			this._processCustomerData(customerData);
		}
		this._sortEligibleCustomersList();
		return this.eligCustomersList;
	}

	/**
	 * @description : Internal-Use function to read the customer-data file line by line using the "readline" module.
	 * > Checks if the data file exists, otherwise throws error
	 * > Creates a reader interface for the provided file
	 * > Implements the "on('line')" method from the reader interface to traverse each line data received by passing "_customerDataReadFromList"
	 * 		function as a line read callback
	 * > Implements the "once" handler to make the program wait till the file read is complete, by reading the "close" event on readerInterface
	 * > Throw specific error only in case if "readInterfaceErrorLine" is truthy, where "readInterfaceErrorLine" would be truthy if
	 * 		there was an error in processing the customer data line and config for "showErrorForFailedCustomerProcessing" was set to true.
	 */
	async _setupReaderInterface() {
		await this.checkFileExists(this.configs.filePath).catch((err) => {
			this.throwError(`The provided file is not present at ${this.configs.filePath}.`);
		});
		this.readInterface = readline.createInterface({
			input: fs.createReadStream(this.configs.filePath)
		});
		this.readInterface.on('line', this._customerDataReadFromList.bind(this));
		await once(this.readInterface, 'close');
		if (!!this.readInterfaceErrorLine) {
			this.throwError(`Error in reading customer data at line ${this.readInterfaceErrorLine}`);
		}
	}

	checkFileExists(filePath) {
		return new Promise((resolve, reject) => {
			fs.access(filePath, fs.F_OK, (err) => {
				if (err) {
					return reject(err);
				}
				resolve(true);
			})
		});
	}

	/**
	 * @param {String} line : The individual line data which was read from the file.
	 * @description : Internal-Use function called after each line is read from the file.
	 * > Tries to parse the line data, using JSON.parse, if the succeeds then adds it to the customer list.
	 * > If an error occurs in parsing the data for the customer, then skips adding the customer to the list.
	 * > If config for "showErrorForFailedCustomerProcessing" was set to true, then it closes the readInterface manually to stop
	 * 		processing further records and sets the "readInterfaceErrorLine" variable to current read line number.
	 */
	_customerDataReadFromList(line) {
		let customerData = false;
		try {
			customerData = JSON.parse(line);
		} catch (err) {
			if (this.configs.showErrorForFailedCustomerProcessing) {
				this.readInterface.close();
				this.readInterfaceErrorLine = this.lineNumberCounter++;
			}
			return false;
		}
		this.customersList.push(customerData);
		this.lineNumberCounter++;
	}

	/**
	 * @param {Object} customerData : The individual customer data which was read from the file, in an Object format.
	 * @description : Internal-Use function called from "_getEligibleCustomers" for each customer's data to check eligibility and process.
	 * > Calls "_checkCustomerEligibility" with received customer data, to check whether the customer is eligible.
	 * > If the customer is eligible and add it to the eligible customers list.
	 * > Throw specific error only in case if the config for "showErrorForFailedCustomerProcessing" is set to true,
	 * 		otherwise throws the previous error received
	 * > Throws specific error if an unhandled exception is received, otherwise skip the current customer
	 */
	_processCustomerData(customerData) {
		try {
			const isEligible = this._checkCustomerEligibility(customerData);
			if (!!isEligible) {
				this.eligCustomersList.push({ user_id: customerData.user_id, name: customerData.name });
			}
		} catch (err) {
			if (this.configs.showErrorForFailedCustomerProcessing) {
				this.throwError(`Error in processing customer ${customerData.name}`, err);
			}
		}
	}

	/**
	 * @param {Object} customerData : The individual customer data which was read from the file, in an Object format.
	 * @description : Internal-Use function called from "_processCustomerData" for each customer's data to check eligibility for customer.
	 * > Calls "_calculateCustomerDistanceFromSource" with received customer data, to check whether the customer is eligible,
	 * 		based on the distance between him and provided source's coordinates.
	 * > If the customer is eligible return true otherwise false.
	 * > Throws specific error if an unhandled exception is received, otherwise returns false.
	 */
	_checkCustomerEligibility(customerData) {
		try {
			const customerDistance = this._calculateCustomerDistanceFromSource(customerData);
			if (Number(customerDistance) <= this.configs.distance) {
				return true;
			}
		} catch (err) {
			this.throwError(`There was an error in checking eligibility for ${customerData.name}`, err);
		}
		return false;
	}

	/**
	 * @param {Object} customerData : The individual customer data which was read from the file, in an Object format.
	 * @description : Internal-Use function called from "_checkCustomerEligibility" for customer data to calculate customer's distance from source.
	 * > Calls "distanceCalc" API to calculate customer's distance from source in terms of provided distanceUnits.
	 */
	_calculateCustomerDistanceFromSource(customerData) {
		return distanceCalc(this.configs.sourceCoordinates.latitude,
			this.configs.sourceCoordinates.longitude,
			customerData.latitude,
			customerData.longitude,
			this.configs.distanceUnit);
	}

	/**
	 * @description : Internal-Use function called from "_getEligibleCustomers" to sort the eligible customer list.
	 * > Uses array sort method to sort based in the sorting field and sorting type provided in configs.
	 * > Negates the value if the sorting type was descending otherwise sorts in ascending order.
	 */
	_sortEligibleCustomersList() {
		this.eligCustomersList.sort((customerNext, customerPrev) => {
			let sortValue = customerNext[this.configs.customerSortingField] - customerPrev[this.configs.customerSortingField];
			return (this.configs.sortingType == 'DESC') ? -sortValue : sortValue;
		});
	}

	/**
	 *
	 * @param {String} errMsg : The error  message that is to be thrown
	 * @param {Error} parentErr : The previous/parent error object received.
	 * @description : If there was some previous error then check if the parentError is a handled exception then
	 * 		throw the parentError to get to the atomic level of error, else throw the parent error only if
	 * 		global config for "showUnhandledExceptions" is set to true.
	 *	If there was no previous error then throw the currently passed error message.
	 */
	throwError(errMsg, parentErr) {
		if (parentErr) {
			if (parentErr instanceof AppError) {
				throw parentErr;
			} else if (global.configs.showUnhandledExceptions) {
				throw parentErr;
			}
		}
		throw new AppError(errMsg);
	}

	//Getter for configs property.
	get configs() {
		return this._configs;
	}

	//Setter for configs property.
	set configs(configs) {
		return this._configs = configs;
	}

	//Getter for customersList property, which holds the list of complete customers read from the data-file.
	get customersList() {
		return this._customersList;
	}

	//Setter for customersList property.
	set customersList(customersList) {
		return this._customersList = customersList;
	}

	//Getter for eligCustomersList property, which holds the list of all eligible customers read from the data-file.
	get eligCustomersList() {
		return this._eligCustomersList;
	}

	//Setter for eligCustomersList property.
	set eligCustomersList(eligCustomersList) {
		return this._eligCustomersList = eligCustomersList;
	}

	//Getter for lineNumberCounter property, which holds counter value for the current line read from the file,
	//used to calculate the "readInterfaceErrorLine" number in case there was an error in reading customer data line.
	get lineNumberCounter() {
		return this._lineNumberCounter;
	}

	//Setter for lineNumberCounter property
	set lineNumberCounter(lineNumberCounter) {
		return this._lineNumberCounter = lineNumberCounter;
	}

	//Getter for readInterfaceErrorLine property, which holds line number in case there was an error in reading customer data line.
	get readInterfaceErrorLine() {
		return this._readInterfaceErrorLine;
	}

	//Setter for readInterfaceErrorLine property
	set readInterfaceErrorLine(readInterfaceErrorLine) {
		return this._readInterfaceErrorLine = readInterfaceErrorLine;
	}
}
module.exports = BaseApp;