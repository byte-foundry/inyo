describe('Client', () => {
	beforeEach(() => {
		cy.visit('/auth/sign-in');

		cy.get('input[name=email]')
			.type('notused@used.email')
			.should('have.value', 'notused@used.email')
			.blur();

		cy.get('input[name=password]')
			.type('testtest')
			.should('have.value', 'testtest')
			.blur();

		cy.contains('Se connecter').click();

		cy.url().should('include', 'app/tasks');

		cy.contains('Clients').click();

		cy.url().should('include', 'app/customers');
	});

	it('should ask for a name and an email', () => {
		cy.contains('Créer un nouveau client').click();

		cy.contains('Valider').click();

		cy.get('input[name=name]+.input-feedback').contains('Requis');
		cy.get('input[name=email]+.input-feedback').contains('Requis');
	});

	it('should ask for either a title, first name or last name', () => {
		cy.contains('Créer un nouveau client').click();

		cy.get('input[name=name]')
			.type('Entreprise A')
			.should('have.value', 'Entreprise A')
			.blur();

		cy.get('input[name=email]')
			.type('jean@michel.test')
			.should('have.value', 'jean@michel.test')
			.blur();

		cy.contains('Valider').click();

		cy.get('#title+.input-feedback').contains('Requis');
		cy.get('input[name=firstName]+.input-feedback').contains('Requis');
		cy.get('input[name=lastName]+.input-feedback').contains('Requis');
	});

	it('should allow to create a customer', () => {
		cy.contains('Créer un nouveau client').click();

		cy.get('input[name=name]')
			.type('Entreprise A')
			.should('have.value', 'Entreprise A')
			.blur();

		cy.get('input[name=firstName]')
			.type('Jean')
			.should('have.value', 'Jean')
			.blur();

		cy.get('input[name=lastName]')
			.type('Michel')
			.should('have.value', 'Michel')
			.blur();

		cy.get('input[name=email]')
			.type('jean@michel.test')
			.should('have.value', 'jean@michel.test')
			.blur();

		cy.contains('Valider').click();

		cy.contains("Présentation d'Inyo à votre client");

		cy.contains("Copier l'email");

		cy.contains('Fermer').click();

		cy.contains('jean@michel.test').click();

		cy.get('input[name=firstName]').should('have.value', 'Jean');

		cy.get('input[name=lastName]').should('have.value', 'Michel');

		cy.get('input[name=email]').should('have.value', 'jean@michel.test');
	});

	it('should update a customer', () => {
		cy.contains('jean@michel.test').click();

		cy.get('input[name=firstName]')
			.clear()
			.type('Jeanne')
			.should('have.value', 'Jeanne');

		cy.get('[data-test=customer-notes] [contenteditable=true]')
			.clear()
			.type('Remembering a few things about my customer.')
			.then(([element]) => {
				expect(element.textContent).to.equal(
					'Remembering a few things about my customer.',
				);
			});

		cy.contains('Valider').click();

		cy.contains('jean@michel.test').click();

		cy.get('input[name=firstName]').should('have.value', 'Jeanne');
	});

	it('should delete a customer', () => {
		cy.contains('tr', 'jean@michel.test')
			.find('[data-test=customer-delete]')
			.click();

		cy.contains('Valider').click();

		cy.contains('jean@michel.test').should('not.exist');
	});
});
