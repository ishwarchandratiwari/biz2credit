# Biz2Credit Code Challenge

## Requirements

Assignment – Coding Challenge:
- We have some customer records in a text file (customers.txt) -- one customer per line, JSON lines formatted. We want to invite any customer within 100km of Dublin for some food and drinks on us. Write a program that will read the full list of customers and output the names and user ids of matching customers (within 100km), sorted by User ID (ascending).
- Don't forget, you'll need to convert degrees to radians.
- The GPS coordinates for Dublin area is 53.339428, -6.257664. We're looking for you to produce working code, with enough room to demonstrate how to structure components in a small program. Package the searching algorithm as an abstraction layer and installable component through npm package.

## Usage

### Require

```javascript
let Biz2Credit = require('biz2credit-code-shubham');
```

### Calling the API with defaults

```javascript
let Biz2Credit = require('biz2credit-code-shubham');
let b2c = new Biz2Credit();

b2c.getEligibleCustomers().catch((err) => {
	console.log(`Error received: `, err.message);
}).then((eligibleCustomers) => {
	console.log(eligibleCustomers);
});
```

### Providing Custom Configrations/Options

#### Providing Customer Eligibility Distance as 50 Miles
```javascript
let Biz2Credit = require('biz2credit-code-shubham');
let b2c = new Biz2Credit();

let options = {
	distanceUnit: 'M',
	distance 	: 50
};
b2c.getEligibleCustomers(options).catch((err) => {
	console.log(`Error received: `, err.message);
}).then((eligibleCustomers) => {
	console.log(eligibleCustomers);
});
```

#### Providing Custom File Path
```javascript
let Biz2Credit = require('biz2credit-code-shubham');
let b2c = new Biz2Credit();

let options = {
	filePath : '<complete path of the file>'
};
b2c.getEligibleCustomers(options).catch((err) => {
	console.log(`Error received: `, err.message);
}).then((eligibleCustomers) => {
	console.log(eligibleCustomers);
});
```

#### Providing Custom Source Address, Like your Noida office instead of Dublin

```javascript
let Biz2Credit = require('biz2credit-code-shubham');
let b2c = new Biz2Credit();

let options = {
	sourceCoordinates: {
		latitude	: 28.583176,
		longitude	: 77.318184
	}
};
b2c.getEligibleCustomers(options).catch((err) => {
	console.log(`Error received: `, err.message);
}).then((eligibleCustomers) => {
	console.log(eligibleCustomers);
});
```