import {testConfig, userForPost} from '../support';

const {notCreated, alreadyExisting} = testConfig;

describe('Sign up', () => {
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

	beforeEach(() => {
		cy.visit('/');

		cy.url().should('include', '/auth/sign-up');
	});

	it('should require an email, a password, a last name and a firstname', () => {
		cy.get('#toscheck').click();
		cy.contains('Commencez').click();

		cy.get('.input-feedback').should('have.length', 4);
	});

	it('should not allow an invalid email', () => {
		cy.get('#toscheck').click();
		cy.get('input[name=email]')
			.type('already@prout')
			.should('have.value', 'already@prout')
			.blur();

		cy.contains('email doit être valide');
	});

	it('should not allow a already used email', () => {
		cy.get('#toscheck').click();
		cy.get('input[name=email]')
			.type(alreadyExisting.email)
			.should('have.value', alreadyExisting.email)
			.blur();

		cy.contains('email est déjà utilisé');
	});

	it('should allow to sign up', () => {
		cy.get('#toscheck').click();
		cy.get('input[name=email]')
			.type(notCreated.email)
			.should('have.value', notCreated.email);

		cy.get('input[name=password]')
			.type(notCreated.password)
			.should('have.value', notCreated.password);

		cy.get('input[name=firstname]')
			.type(notCreated.firstName)
			.should('have.value', notCreated.firstName);

		cy.get('input[name=lastname]')
			.type(notCreated.lastName)
			.should('have.value', notCreated.lastName);

		cy.contains('Commencez').click();

		cy.url().should('include', '/app/onboarding');

		cy.contains('Nous avons besoin de quelques');
	});
});
