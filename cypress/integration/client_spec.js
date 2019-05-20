describe('Client', function() {
	it('should allow to create a client', function() {
		cy.visit('http://localhost:3000/auth/sign-in');

		cy.get('input[name=email]')
			.type('notused@used.email')
			.should('have.value', 'notused@used.email').blur();

		cy.get('input[name=password]')
			.type('testtest')
			.should('have.value', 'testtest').blur();

		cy.contains('Se connecter').click();

		cy.url().should('include', 'app/tasks');

		cy.contains('Clients').click();

		cy.url().should('include', 'app/customers');
	});
});
