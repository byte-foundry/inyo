import {testConfig, userForPost} from '../support';

const {baseUser} = testConfig;

describe('Sign in', () => {
	before(() => {
		cy.request({
			url: 'https://prisma-dev.inyo.me/prep-for-test',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userForPost),
		});
	});

	it('should require an email and a password', () => {
		cy.visit('/');

		cy.url().should('include', '/auth/sign-up');

		cy.contains('Se connecter').click();

		cy.url().should('include', '/auth/sign-in');

		cy.contains('Se connecter').click();

		cy.get('.input-feedback').should('have.length', 2);
	});

	it('should require a valid email', () => {
		cy.visit('/auth/sign-in');

		cy.get('input[name=email]')
			.type('a')
			.should('have.value', 'a')
			.blur();

		cy.contains("email n'est pas valide");
	});

	it('should require a valid account', () => {
		cy.visit('/auth/sign-in');

		cy.get('input[name=email]')
			.type('doesnot@exist.account')
			.should('have.value', 'doesnot@exist.account')
			.blur();

		cy.get('input[name=password]')
			.type('testtest')
			.should('have.value', 'testtest')
			.blur();

		cy.contains('Se connecter').click();

		cy.contains('Mauvais email ou mot de passe');
	});

	it('should require a valid passord', () => {
		cy.visit('/auth/sign-in');

		cy.get('input[name=email]')
			.type(baseUser.email)
			.should('have.value', baseUser.email)
			.blur();

		cy.get('input[name=password]')
			.type('testtest1')
			.should('have.value', 'testtest1')
			.blur();

		cy.contains('Se connecter').click();

		cy.contains('Mauvais email ou mot de passe');
	});

	it('should allow user to sign in ', () => {
		cy.visit('/auth/sign-in');

		cy.get('input[name=email]')
			.type(baseUser.email)
			.should('have.value', baseUser.email)
			.blur();

		cy.get('input[name=password]')
			.type(baseUser.password)
			.should('have.value', baseUser.password)
			.blur();

		cy.contains('Se connecter').click();

		cy.url().should('include', '/app/tasks');
	});
});
