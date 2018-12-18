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
						name: 'Benchmark',
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
						name: 'Validation du cahier des charges',
						unit: 0,
						description: '',
						reviewer: 'CUSTOMER',
					},
					{
						name: 'Moodboard',
						unit: 0.5,
						description: '',
					},
				],
			},
			{
				name: 'Conception',
				items: [
					{
						name: 'Architecture du site (arborescence)',
						unit: 0.25,
						description: '',
					},
					{
						name:
							'Création d’une charte fonctionnelle selon le cahier des charges',
						unit: 1,
						description: '',
					},
					{
						name:
							'Wireframes de l’ensemble des pages clefs et interactions',
						unit: 2,
						description:
							'Temps estimé sur la base de 10 pages clefs.',
					},
					{
						name:
							'Validation de l’ensemble des pages clefs et interactions',
						unit: 0.5,
						description:
							'1 aller/retour corrections est prévu dans la proposition commerciale',
						reviewer: 'CUSTOMER',
					},
					{
						name:
							'Envoi de l’ensemble des contenus textes + images',
						unit: 0,
						description: '',
						reviewer: 'CUSTOMER',
					},
					{
						name: 'Direction artistique',
						unit: 2,
						description: '',
					},
					{
						name: 'Validation de la direction artistique',
						unit: 1,
						description:
							'2 aller/retour corrections sont prévus dans la proposition commerciale',
						reviewer: 'CUSTOMER',
					},
					{
						name:
							'Traitement de vos images pour les optimiser pour le web',
						unit: 0.5,
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
						name: 'Intégration des contenus (base 10 pages)',
						unit: 1,
						description: '',
					},
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
						name: 'Validation du site et de ses contenus',
						unit: 0,
						description: '',
						reviewer: 'CUSTOMER',
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
						name: 'Formation au back-office',
						unit: 0.25,
						description: '',
					},
					{
						name: 'Envoi facture',
						unit: 0,
						description: '',
					},
					{
						name: 'Paiement facture',
						unit: 0,
						description: '',
						reviewer: 'CUSTOMER',
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
