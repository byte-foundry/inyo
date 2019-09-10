describe('Onboarding', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000/auth/sign-in');

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
	});

	it('should present the first step of onboarding', () => {
		cy.visit('http://localhost:3000/app/onboarding');

		cy.get('.css-tsu775').should('have.length', 5);
		cy.get('.css-1gn76i3').should('have.length', 2);

		cy.contains('dim.').click();

		cy.get('.css-tsu775').should('have.length', 6);
		cy.get('.css-1gn76i3').should('have.length', 1);

		cy.contains('dim.').click();

		cy.get('.css-tsu775').should('have.length', 5);
		cy.get('.css-1gn76i3').should('have.length', 2);

		cy.contains('Continuer').click();

		cy.contains("Qu'est-ce qui vous ennuie le plus au quotidien");

		cy.contains('Retour').click();

		cy.get('.css-tsu775').should('have.length', 5);
		cy.get('.css-1gn76i3').should('have.length', 2);

		cy.contains('Continuer').click();

		cy.get('.css-u6eok3').should('have.length', 5);

		cy.contains('Jongler').click();
		cy.get('.css-otmsfm').should('have.length', 1);
		cy.get('.css-u6eok3').should('have.length', 4);

		cy.contains('Continuer').click();

		cy.contains('Comment souhaitez-vous appeler');

		cy.get('input')
			.type('Yannus')
			.should('have.value', 'EdwigeYannus');

		cy.contains('Valider').click();

		cy.contains('Oui').click();

		cy.get('input[name=phone]')
			.click()
			.blur();

		cy.contains('Requis');

		cy.get('input[name=phone]').type('06 06 06 06 06');

		cy.contains('Continuer').click();

		cy.url().should('include', 'app/tasks');
	});

	it('should display empty views', () => {
		cy.contains('Aucune tâche à faire pour le moment');

		cy.contains('Projets').click();

		cy.contains('Aucun projet en cours');

		cy.get(
			'.css-1h9djfa-IllusText > :nth-child(2) > :nth-child(1)',
		).click();

		cy.contains('Utiliser un de nos modèles');

		cy.get('.css-1ic2po7').click();

		cy.get(
			'.css-1h9djfa-IllusText > :nth-child(2) > :nth-child(2)',
		).click();

		cy.contains('Se baser');

		cy.get('.css-1ic2po7').click();

		cy.contains('Dashboard').click();

		cy.contains("Vous n'avez pas de tâches prévues");

		cy.contains('Aucune tâche client n');

		cy.get('.css-3tccu1-Help').click();

		cy.contains('Aide').click();
		cy.contains("J'ai compris!").click();
	});
});
