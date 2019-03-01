export const templates = [
	// eslint-disable-line import/prefer-default-export
	{
		name: 'PROSPECTION',
		label: 'Trouver des clients',
		sections: [
			{
				name: 'Utilisez vos expériences passées',
				items: [
					{
						name: 'Recontacter ses anciens clients',
						unit: 0.5,
						description:
							"Chercher de nouveaux clients est plus difficile que de convaincre d'anciens clients de faire de nouveau appel à vos services.",
					},
					{
						name:
							'Demander à vos anciens clients de vous recommander',
						unit: 0.5,
						description:
							"Si vous ne l'avez pas encore fait, c'est le moment de contacter vos clients précédents pour que ceux-ci recommande vos compétences sur Linkedin et sur votre expérience commune.",
					},
				],
			},
			{
				name: 'Augmentez votre visibilité',
				items: [
					{
						name: 'Se référencer sur Google Business',
						unit: 0.1,
						description:
							"Afin qu'on puisse vous trouver sur Google Maps et autres outils de Google, vous devez vous créer un profil pour optimiser vos chances de sortir dans une recherche Google. \n\n [S'enregistrer sur Google Business](https://www.google.fr/business)",
					},
					{
						name: 'Se référencer sur le site des Pages Jaunes',
						unit: 0.1,
						description:
							'Cela peut vous paraître étonnant, mais beaucoup de clients utilisent encore les Pages Jaunes pour trouver un professionnel.\n\n[Se référencer sur les Pages Jaunes](https://www.pagesjaunes.fr)',
					},
					{
						name:
							"S'inscrire sur des plateformes destinées aux freelances",
						unit: 0.5,
						description:
							"Aujourd'hui de nombreuses entreprises passent par ces nouvelles plateformes. Nous vous encourageons à créer des profils sur les plus connues comme [Malt](https://www.malt.fr/profile) ou encore [Upwork](https://www.upwork.com).",
					},
					{
						name: 'Créer un profil LinkedIn performant',
						unit: 0.25,
						description:
							'Avoir un profil Linkedin est un minimum et autant faire en sorte que celui-ci soit performant: bien renseigner vos compétences, une description et une photo soignée et de liens vers quelques unes de vos références. Pensez à bien indiquer que vous êtes freelance, cela augmentera vos chances de ressortir dans les résultats de recherches.\n\nQuelques bon conseils sont à prendre sur [ce site.](https://www.codeur.com/blog/creer-profil-linkedin-puissant/)',
					},
					{
						name: 'Mettre-à-jour ou créer son site internet',
						unit: 2,
						description:
							"Vous vous en doutiez, un site est le moyen le plus complet et efficace de vous représenter. Si vous en possédez un, c'est le moment de le mettre à jour et d'en informer votre réseau (emails + réseaux sociaux). Si vous n'en avez pas encore, ne traînez plus et allez de ce pas en créer un avec les nombreux outils qui existent sur le web. Wordpress est le plus répandu et vous permettra de choisir un modèle parmi des milliers:\n\n[Créer un site vitrine sur Wordpress.com](https://wordpress.com)\n\nIl existe bien évidemment des alternatives: [Webflow,](https://webflow.com) [Squarespace,](https://fr.squarespace.com/) [Weebly,](https://www.weebly.com/) etc.",
					},
				],
			},
			{
				name: 'Recherchez les offres en cours',
				items: [
					{
						name: 'Créer une alerte Linkedin Jobs',
						unit: 0.1,
						description:
							"Sur Linkedin il est possible de créer des recherches très précises et des alertes associées pour vous signaler une nouvelle offre de mission. Nous vous invitons fortement à créer votre propre alerte avec les mots clefs qui correspondent à votre profil.\n\n[Personnaliser ma recherche Linkedin](https://www.linkedin.com/jobs/search/?country=fr&pageNum=0&position=1&f_TP=1%2C2&keywords=Freelance&location=France)\n\nN'oubliez pas d'activer les alertes une fois cette recherche affinée.",
					},
					{
						name: 'Créer une recherche avancée sur twitter',
						unit: 0.1,
						description:
							"Ce n'est pas forcément la 1ère plateforme à laquelle on penserait, mais de nombreux clients postent leurs demandes sur Twitter. Ces offres peuvent parfois être moins sérieuses que sur Linkedin mais il est facile de se faire une idée rapidement.\n\n[Créer votre recherche avancée Twitter](https://twitter.com/search-advanced?lang=fr) et faîtes vous une idée par vous même (vous risquez d'être agréablement surpris)",
					},
				],
			},
			{
				name: 'Communiquez sur votre recherche',
				items: [
					{
						name:
							'Annoncer sa disponibilité sur les réseaux sociaux',
						unit: 0.1,
						description:
							"Votre réseau est votre allié. Postez sur les réseaux sociaux que vous êtes actuellement disponible et à la recherche de nouvelles missions. N'oubliez de mettre un lien vers vos références et votre spécialité!",
					},
					{
						name: 'Faire appel à la communauté Inyo',
						unit: 0.1,
						description:
							"La communauté Inyo grandit de jours en jours et compte des freelances aux nombreuses compétences: design graphique, développement, conception/rédaction, traduction, etc. N'hésitez pas à poster une annonce sur le [Slack](https://inyo-freelancers.slack.com) pour proposer vos services ou échanger vos bonnes pratiques!\n\n[Me connecter à la communauté Inyo](https://inyo-freelancers.slack.com)",
					},
				],
			},
		],
	},
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
							'1 aller-retour corrections est prévu dans la proposition commerciale',
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
							'2 aller-retour corrections sont prévus dans la proposition commerciale',
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
						description: '',
					},
					{
						name: 'Validation de l’ensemble des pages',
						unit: 0.5,
						description:
							'1 aller-retour corrections est prévu dans la proposition commerciale',
						reviewer: 'CUSTOMER',
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
						description: '',
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
						description: '',
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
						name: 'Benchmark',
						unit: 0.5,
						description: '',
					},
					{
						name:
							"Rédaction d'un cahier des charges et des valeurs de l'entreprise",
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
						name: 'Création de 3 axes créatifs',
						unit: 3,
						description: '',
					},
					{
						name: "Validation d'un axe créatif",
						unit: 0,
						description: '',
						reviewer: 'CUSTOMER',
					},
					{
						name: "Mise au point de l'axe retenu",
						unit: 1,
						description: '',
					},
					{
						name: 'Validation',
						unit: 0,
						description:
							'2 allers-retours sont prévus dans la proposition commerciale',
						reviewer: 'CUSTOMER',
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
						name: 'Conception charte graphique utilisation logo',
						unit: 1,
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
		name: 'BLANK',
		label: 'Vierge',
		sections: [
			{
				name: 'Pré-projet',
				items: [
					{
						name: 'Réunion de lancement',
						unit: 0.5,
						description: '',
					},
				],
			},
			{
				name: 'Modifier le titre de cette section',
				items: [
					{
						name: 'Modifier le titre de cette tâche',
						unit: 0,
						description: '',
					},
				],
			},
			{
				name: 'Divers',
				items: [
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
];

export const onboardingTemplate = {
	name: 'ONBOARDING',
	label: 'Onboarding',
	sections: [
		{
			name: 'Pour commencer…',
			items: [
				{
					name: '✌️ Cliquer sur cette tâche!',
					unit: 0,
					description:
						"Bienvenue sur cet onboarding! Cliquez sur le bouton en haut à droite pour commencer ce projet fictif. N'oubliez pas de marquer cette tâche comme achevée ensuite ✅",
				},
				{
					name: "🙋 Attendre le mail d'accueil par Edwige de Inyo",
					unit: 0,
					description:
						"Cette tâche est attribuée à votre client, ce qui signifie que vous êtes en attente d'une action de sa part. Inyo va se charger de le relancer automatiquement pour s'assurer que celui-ci s'en charge en temps et en heure. Vous ne raterez plus aucune deadline 🎉",
					reviewer: 'CUSTOMER',
				},
				{
					name: '✏️ Ajouter un commentaire',
					unit: 0,
					description: '',
				},
				{
					name: '👀 Ouvrir cette tâche et lire la description',
					unit: 0,
					description:
						'Pour chaque tâche, vous pouvez définir qui doit la réaliser, son titre, sa description et la durée estimée de cette tâche. Modifiez le titre de celle-ci et validez 👀',
				},
			],
		},
		{
			name: '…et pour finir',
			items: [
				{
					name: '😎 Compléter son profil',
					unit: 0,
					description:
						'Pour remplir votre profil, rendez-vous sur cette page: https://beta.inyo.me/app/account',
				},
				{
					name:
						'🚀 Créer un nouveau projet en modifiant un modèle existant',
					unit: 0.1,
					description:
						"Vous connaissez à présent les options de base pour créer un projet, il ne vous reste plus qu'à les appliquer! 🎉🎉🎉 Pour vous aider, nous proposons des templates prédéfinis car nous savons que la création de projets est toujours une tâche fastidieuse: créer dès maintenant un projet et commencer à gagner du temps! https://beta.inyo.me/app/projects/create",
				},
				{
					name:
						'🏆 Envoyer un email à edwige@inyo.me et donner une note sur 10 à cet onboarding',
					unit: 0,
					description: 'Merci 😍',
				},
			],
		},
	],
};
