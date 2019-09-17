/**
 * @class 		: AppError
 * @author 		: Shubham Verma
 * @created 	: 2019-09-18
 * @extends 	: Error class provided natively by Node.js
 * @description : Created as an extention to the default Error class in node.js.
 * To distinguish between handled exceptions vs unhandled exceptions.
 * All the errors thrown explicitly in whole application would be of this specific class.
 *
 */
class AppError extends Error {
	constructor(error) {
		super(error);
		this.name = this.constructor.name;
		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, this.constructor);
		} else {
			this.stack = (new Error(error)).stack;
		}
	}
}
module.exports = AppError;