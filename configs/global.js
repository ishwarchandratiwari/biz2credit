/**
 * Configuration Description is as follows :
 * > showUnhandledExceptions: Show Unhandled exceptions to the end-users, useful while debugging
 * 		the application, when set to true would start throwing errors at atomic level
 */
const GLOBAL_CONFIGS = {
	showUnhandledExceptions : false
};
module.exports = global.configs = GLOBAL_CONFIGS;