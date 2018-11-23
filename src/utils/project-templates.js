export const templates = [
	// eslint-disable-line import/prefer-default-export
	{
		name: 'WEBSITE',
		label: 'Site web',
		sections: [
			{
				name: 'Pré-projet',
				items: [
					{
						name: 'Réunion de lancement',
						unit: 0.5,
						description: '',
					},
					{
						name:
							"Rédaction d'un cahier des charges et des principales fonctionnalités",
						unit: 1,
						description: '',
					},
					{
						name: 'Validation',
						unit: 0,
						description: '',
						reviewer: 'CUSTOMER',
					},
				],
			},
			{
				name: 'Conception',
				items: [
					{
						name: 'Benchmark',
						unit: 0.5,
						description: '',
					},
					{
						name: 'Moodboard',
						unit: 0.5,
						description: '',
					},
					{
						name: 'Architecture du site (arborescence)',
						unit: 0.25,
						description: '',
					},
					{
						name:
							'Wireframes de l’ensemble des pages clefs et interactions (base 10 pages)',
						unit: 2,
						description:
							' Validation + 1 A/R corrections et compte rendu',
					},
					{
						name: 'Direction artistique',
						unit: 2,
						description:
							'Validation + 2 A/R corrections et compte rendu',
					},
					{
						name:
							'Création d’une charte fonctionnelle selon le cahier des charges',
						unit: 1,
						description: '',
					},
					{
						name: 'Design de l’ensemble des pages',
						unit: 4,
						description:
							'Validation + 1 A/R corrections + compte rendu',
					},
					{
						name:
							'Déclinaison maquettes Responsive design 1 point de rupture 1024',
						unit: 1,
						description: '',
					},
				],
			},
			{
				name: 'Développement',
				items: [
					{
						name: 'Configuration nom de domaine + base MySQL',
						unit: 0.25,
						description: '',
					},
					{
						name: "Installation d'un CMS",
						unit: 0.25,
						description: '',
					},
					{
						name:
							'Intégration des pages clefs principales et annexes (base 10 pages)',
						unit: 8,
						description: 'Validation + 1 A/R corrections',
					},
					{
						name: 'Responsive design 1 point de rupture 1024',
						unit: 1,
						description: '',
					},
				],
			},
			{
				name: 'Tests, corrections et mise en ligne',
				items: [
					{
						name: 'Compatibilité navigateurs',
						unit: 1.5,
						description: '',
					},
					{
						name: 'Tests (Phase de recette) et corrections',
						unit: 1,
						description: '+ Validation',
					},
					{
						name: 'Mise en production',
						unit: 0,
						description: '',
					},
				],
			},
			{
				name: 'Divers',
				items: [
					{
						name: 'Gestion et suivi de projet',
						unit: 1,
						description: '',
					},
					{
						name: 'Formation au back-office',
						unit: 0.25,
						description: '',
					},
				],
			},
			{
				name: 'Maintenance',
				items: [
					{
						name: 'Hébergement',
						unit: 0.25,
						description: '',
					},
				],
			},
			{
				name: 'Options',
				items: [
					{
						name: 'Mises-à-jour',
						unit: 0,
						description: '',
					},
					{
						name: 'Formulaire de contact',
						unit: 0.5,
						description: '',
					},
					{
						name: 'Système de newsletter',
						unit: 0.5,
						description: '',
					},
					{
						name: 'Système sauvegardes BDD',
						unit: 0.25,
						description: '',
					},
					{
						name: "Blocage des tentatives d'intrusion",
						unit: 0.25,
						description: '',
					},
					{
						name: 'Intégration des contenus (base 10 pages)',
						unit: 1,
						description: '',
					},
					{
						name:
							'Traitement de vos images pour les optimiser pour le web',
						unit: 0.5,
						description: '',
					},
				],
			},
		],
	},
	{
		name: 'IDENTITY',
		label: 'Identité visuelle',
		sections: [
			{
				name: 'Pré-projet',
				items: [
					{
						name: 'Réunion de lancement',
						unit: 0.5,
						description: '',
					},
					{
						name:
							"Rédaction d'un cahier des charges et définition des valeurs de l'entreprise",
						unit: 0.25,
						description: '',
					},
					{
						name: 'Validation',
						unit: 0,
						description: '',
					},
				],
			},
			{
				name: 'Conception',
				items: [
					{
						name: 'Benchmark',
						unit: 0.5,
						description: '',
					},
					{
						name: 'Moodboard',
						unit: 0.75,
						description:
							'— Dont réunion téléphonique pour valider les directions: 0.25',
					},
					{
						name: 'Création de 3 axes créatifs',
						unit: 2.5,
						description: '— Validation',
					},
					{
						name: "Mise au point de l'axe retenu",
						unit: 1,
						description:
							'Dont 2 allers-retours + compte-rendu des échanges et validation: 0.25',
					},
					{
						name:
							'Déclinaisons du logo en couleur et en noir & blanc ',
						unit: 0.25,
						description: '',
					},
					{
						name:
							'Préparation des fichiers aux formats nécessaires pour une utilisation Print et Web',
						unit: 0.25,
						description: '',
					},
				],
			},
			{
				name: 'Divers',
				items: [
					{
						name: 'Gestion et suivi de projet',
						unit: 1,
						description: '',
					},
					{
						name: 'Cession des droits',
						unit: 0.25,
						description: '',
					},
					{
						name: 'Achat typographique',
						unit: 0.25,
						description: '',
					},
					{
						name: 'Conception charte graphique utilisation logo',
						unit: 1,
						description: '',
					},
				],
			},
		],
	},
	{
		name: 'BLANK',
		label: 'Vierge',
		sections: [],
	},
];
