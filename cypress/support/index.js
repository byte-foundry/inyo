// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')
Cypress.on('uncaught:exception', (err, runnable) => false);

export const testConfig = {
	baseUser: {
		email: 'base@user.email',
		password: 'testtest',
		firstName: 'Jack',
		lastName: 'Lang',
	},
	baseUser: {
		email: 'base@user.email',
		password: 'testtest',
		firstName: 'Jack',
		lastName: 'Lang',
	},
	alreadyExisting: {
		email: 'already@used.email',
		password: 'testtest',
		firstName: 'Jack',
		lastName: 'Lang',
	},
	notCreated: {
		email: 'notused@used.email',
		password: 'testtest',
		firstName: 'Jack',
		lastName: 'Lang',
	},
};

export const userForPost = {
	users: [testConfig.baseUser, testConfig.alreadyExisting],
};
