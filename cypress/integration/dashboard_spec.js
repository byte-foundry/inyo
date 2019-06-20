import {testConfig, userForPost} from '../support';

const {baseUser} = testConfig;

describe('Client', () => {
	before(() => {
		cy.request({
			url: 'https://prisma-dev.inyo.me/prep-for-test',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userForPost),
		});

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

		cy.url().should('include', 'app/tasks');

		cy.contains('Dashboard').click();
		cy.contains('Dashboard').click();

		cy.url().should('include', 'app/dashboard');
	});

	it('should be able to drop a task from the list', () => {
		cy.get('.css-101ikum').type('Tâche 1{enter}');

		cy.contains('.css-136buib-TaskContainer', 'Tâche 1').drag(
			'.css-n8vpxk > :nth-child(1) > .css-1j4qrhy > .css-ti9njt',
		);

		cy.contains('.css-n8vpxk > :nth-child(1) > .css-1j4qrhy', 'Tâche 1');
	});

	// don't know why this doesn't work

	// it('should be able to drop a task from the first day to the second', () => {
	// 	cy.contains('.css-n8vpxk > :nth-child(1)', 'Tâche 1')
	// 		.drag('.css-n8vpxk > :nth-child(2) > .css-1j4qrhy > .css-ti9njt', 'center');

	// 	cy.contains('.css-n8vpxk > :nth-child(2) > .css-1j4qrhy', 'Tâche 1')
	// });

	// it('should be able to drop a task from the first day to the list', () => {
	// 	cy.contains('.css-n8vpxk > :nth-child(1)', 'Tâche 1')
	// 		.drag('.css-1bemi39-TasksListContainer', 'center');
	// });

	it('should be able to remove a task from the schedule', () => {
		cy.get('.css-n8vpxk > :nth-child(1) [draggable]').drag('.css-6mxnnv');

		cy.contains('.css-136buib-TaskContainer', 'Tâche 1');
	});
});
