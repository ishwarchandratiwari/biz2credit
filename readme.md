# Biz2Credit Code Challenge

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

#### Providing Customer Eligibility Distance as 50 Miles
```javascript
let Biz2Credit = require('biz2credit-challenge');
let b2c = new Biz2Credit();

let options = {
	distanceUnit : 'M',
	distance : 50
};
b2c.getEligibleCustomers(otions).catch((err) => {
	console.log(`Error received: `, err.message);
}).then((eligibleCustomers) => {
	console.log(eligibleCustomers);
});
```

#### Providing Custom File Path
```javascript
let Biz2Credit = require('biz2credit-challenge');
let b2c = new Biz2Credit();

let options = {
	filePath : '<complete path of the file>'
};
b2c.getEligibleCustomers(otions).catch((err) => {
	console.log(`Error received: `, err.message);
}).then((eligibleCustomers) => {
	console.log(eligibleCustomers);
});
```

#### Providing Custom Source Address, Like your Noida office instead of Dublin

```javascript
let Biz2Credit = require('biz2credit-challenge');
let b2c = new Biz2Credit();

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