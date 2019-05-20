describe('Sign up', function() {
	it('should require an email, a password, a last name and a firstname', function() {
		cy.visit('http://localhost:3000');

		cy.url().should('include', '/auth/sign-up');

		cy.contains('Commencez').click();

		cy.get('.input-feedback')
			.should('have.length', 4);
	});

	it('should not allow an invalid email', function() {
		cy.visit('http://localhost:3000');

		cy.url().should('include', '/auth/sign-up');

		cy.get('input[name=email]')
			.type('already@used')
			.should('have.value', 'already@used').blur();

		cy.contains('email doit être valide');
	});

	it('should not allow a already used email', function() {

		cy.visit('http://localhost:3000');

		cy.url().should('include', '/auth/sign-up');

		cy.get('input[name=email]')
			.type('already@used.email')
			.should('have.value', 'already@used.email').blur();

		cy.contains('email est déjà utilisé');
	});

	it('should allow to sign up', function() {

		cy.visit('http://localhost:3000');

		cy.url().should('include', '/auth/sign-up');

		cy.get('input[name=email]')
			.type('notused@used.email')
			.should('have.value', 'notused@used.email');

		cy.get('input[name=password]')
			.type('testtest')
			.should('have.value', 'testtest');

		cy.get('input[name=firstname]')
			.type('Jack')
			.should('have.value', 'Jack');

		cy.get('input[name=lastname]')
			.type('Lang')
			.should('have.value', 'Lang');

		cy.contains('Commencez').click();

		cy.url().should('include', '/app/onboarding');

		cy.contains('Nous avons besoin de quelques');
	});
});
