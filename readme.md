#Biz2Credit Code Challenge

## Usage

### Require

```javascript
let Biz2Credit = require('biz2credit-challenge');
```

### Calling the API with defaults

```javascript
let Biz2Credit = require('biz2credit-challenge');
let b2c = new Biz2Credit();

b2c.getEligibleCustomers().catch((err) => {
	console.log(`Error received: `, err.message);
}).then((eligibleCustomers) => {
	console.log(eligibleCustomers);
});
```

### Providing Custom Configrations/Options

```javascript
let Biz2Credit = require('biz2credit-challenge');
let b2c = new Biz2Credit();

//To set the customer eligiblity distance as 50 Miles
let options = {
	distanceUnit : 'M',
	distance : 50
};
b2c.getEligibleCustomers(otions).catch((err) => {
	console.log(`Error received: `, err.message);
}).then((eligibleCustomers) => {
	console.log(eligibleCustomers);
});

//To provide custom file path
let options = {
	filePath : '<complete path of the file>'
};
b2c.getEligibleCustomers(otions).catch((err) => {
	console.log(`Error received: `, err.message);
}).then((eligibleCustomers) => {
	console.log(eligibleCustomers);
});

//To provide custom source address, like your noida office instead of dublin
let options = {
	sourceCoordinates: {
		latitude	: 28.583176,
		longitude	: 77.318184
	}
};
b2c.getEligibleCustomers(otions).catch((err) => {
	console.log(`Error received: `, err.message);
}).then((eligibleCustomers) => {
	console.log(eligibleCustomers);
});
```