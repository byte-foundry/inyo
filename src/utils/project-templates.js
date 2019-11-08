export const templates = {
	en: [
		// eslint-disable-line import/prefer-default-export
		{
			name: 'PROSPECTION',
			label: 'Find missions',
			sections: [
				{
					name: 'Use your previous experiences',
					items: [
						{
							name: 'Get in touch with your former clients',
							unit: 0.5,
							description:
								'Finding new clients is more difficult than convincing former satisfied clients to work with you again',
						},
						{
							name: 'Ask your former clients to recommend you',
							unit: 0.5,
							description:
								"If it's not already done, it's time to contact your former clients to recommend your skills on Linkedin and write something about your past experiences.",
						},
					],
				},
				{
					name: 'Increase your visibility',
					items: [
						{
							name: 'Register to Google Business',
							unit: 0.1,
							description:
								'In order to be notable on Google Maps and other Google tools, you need to create a profile to maximize your chances to appear on a Google search.\n\n[Register to Google Business](https://www.google.com/business)',
						},
						{
							name: 'Register to professional directories',
							unit: 0.1,
							description:
								'This may seem surprising, but many customers still use online professional directories to find a professional.',
						},
						{
							name: 'Create an account on freelancer platforms',
							unit: 0.5,
							description:
								'A lot of companies only look at platforms like Upwork or Freelancer.com when they need to hire a freelancer.',
						},
						{
							name: 'Create a powerful Linkedin profile',
							unit: 0.25,
							description:
								'Having a Linkedin profile is essential and you have to make sure that it is effective: be extensive when filling your skills, a description, a neat profile picture and links to your most relevant previous works. Remember to mention that you are freelance, this will increase your chances of appearing in the search results.',
						},
						{
							name:
								'Create a website (or keep it up-to-date if you already have one)',
							unit: 2,
							description:
								"A Website is the most effective way to represent you. If you have one, it's time to update it and spread the word with your network (emails + social networks). If you don't have one yet, it's time to create one with the many tools that exist on the web. Wordpress is the most common and will allow you to choose a model among thousands:\n\nCreate a website with [Wordpress](https://wordpress.com)\n\nThere are alternatives: [Webflow](https://webflow.com), [Squarespace](https://fr.squarespace.com/), [Weebly](https://www.weebly.com/) etc.",
						},
					],
				},
				{
					name: 'Look at job offers',
					items: [
						{
							name: 'Set a Linkedin jobs alert',
							unit: 0.1,
							description:
								'You can create very accurate searches on Linkedin and set alerts when a new offer matches it. We strongly recommand to create your own alert with the right keywords according to your profile:\n\nPersonnalized your Linkedin search: https://www.linkedin.com/jobs/search/?country=fr&pageNum=0&position=1&f_TP=1%2C2&keywords=Freelance&location=France\n\nRemember to activate alerts once this search is refined.',
						},
						{
							name: 'Create an advanced search on Twitter',
							unit: 0.1,
							description:
								'Many clients share their offers on Twitter. Some of them can sometimes be less serious than what you will find on Linkedin but it is easy to quickly figure it out.\n\nCreate your advanced Twitter [search](https://twitter.com/search-advanced?lang=en) and make yourself an idea (you may be pleasantly surprised).',
						},
					],
				},
				{
					name: 'Spread the word about your job seeking',
					items: [
						{
							name:
								'Tell about your availability on social networks',
							unit: 0.1,
							description:
								'Your network is a great ally. Post on social networks that you are currently available and looking for new missions. Do not forget to put a link to your references and your skills!',
						},
						{
							name: 'Call on the Inyo community',
							unit: 0.1,
							description:
								"Inyo's community is growing from day to day and it gathers freelancers with many skills: graphic design, development, design, copywriting, translation, etc\n\nFeel free to ask for advice and help on [Slack](https://join.slack.com/t/inyo-freelancers/shared_invite/enQtNTgzNzA2NjI0NzcyLWM1MmYwMzM5NGVlMmI3MDU0N2U0MDEwYzk2OTViMGJlYzk3MmE1ZWYzZjkzNjFmMzU0OWFkNzYxNjVjYzBiOTk)",
						},
					],
				},
			],
		},
		{
			name: 'WEBSITE',
			label: 'Website',
			sections: [
				{
					name: 'Before starting',
					items: [
						{
							name: 'Preparing Launch meeting',
							description:
								'Research on client and their values, update your portfolio, look for reference and trends in the client space.',
							type: 'PERSONAL',
							unit: 0.2,
							tags: ['Meeting'],
						},
						{
							name: 'Launch meeting',
							unit: 0.5,
							tags: ['Meeting'],
							description: '',
						},
						{
							name: '30% deposit',
							unit: 0,
							tags: ['Admin'],
							description: '',
							type: 'INVOICE',
						},
						{
							name: 'Benchmark',
							unit: 0.5,
							description: '',
						},
						{
							name: 'Requirements gathering',
							unit: 1,
							description: '',
						},
						{
							name: 'Validation of the requirements',
							unit: 0,
							tags: ['Important'],
							description: '',
							type: 'CUSTOMER',
						},
						{
							name: 'Moodboard',
							unit: 0.5,
							description: '',
						},
					],
				},
				{
					name: 'Design',
					items: [
						{
							name: 'Website architecture',
							unit: 0.25,
							description: '',
						},
						{
							name:
								'Designing the functionality based on the requirements',
							unit: 1,
							description: '',
						},
						{
							name:
								'Designing the wireframes of all key pages and interactions',
							unit: 2,
							description:
								'The time we provide is based on 10 pages',
						},
						{
							name: 'Key pages and interactions validation',
							unit: 0.5,
							tags: ['Important'],
							description:
								'1 back-and-forth based on clients feedback accounted for',
							type: 'CUSTOMER',
						},
						{
							name:
								'Sending all the content needed for the creation of the website (images and text)',
							unit: 0,
							description: `

	# content-acquisition-list
	- [ ] vector logo
	- [ ] main menu content
	- [ ] text content
	- [ ] HD images`,
							type: 'CONTENT_ACQUISITION',
						},
						{
							name: 'Artistic direction',
							unit: 2,
							description: '',
						},
						{
							name: 'Artistic direction validation',
							unit: 1,
							tags: ['Important'],
							description:
								'2 back-and-forth are accounted for based on feedback from the client',
							type: 'CUSTOMER',
						},
						{
							name: 'Responsive mock-up (1 breakpoint at 1024px)',
							unit: 1,
							description: '',
						},
					],
				},
				{
					name: 'Development',
					items: [
						{
							name: 'Domain name configuration + MySQL setup',
							unit: 0.25,
							description: '',
						},
						{
							name: 'CMS setup',
							unit: 0.25,
							description: '',
						},
						{
							name: 'Pages integration',
							unit: 8,
							description: '',
						},
						{
							name: 'Responsive design (1 breakpoint at 1024px)',
							unit: 1,
							description: '',
						},
					],
				},
				{
					name: 'Test, fixes and release',
					items: [
						{
							name: 'Content integration (10 pages)',
							unit: 1,
							description: '',
						},
						{
							name: 'Web browser compatibility',
							unit: 1.5,
							description: '',
						},
						{
							name: 'Acceptance tests and fixes',
							unit: 1,
							description: '',
						},
						{
							name: 'Website and content validation',
							unit: 0,
							tags: ['Important'],
							description: '',
							type: 'CUSTOMER',
						},
						{
							name: 'Release',
							unit: 0,
							description: '',
						},
					],
				},
				{
					name: 'Misc',
					items: [
						{
							name: 'Backoffice training',
							unit: 0.25,
							description: '',
						},
						{
							name: 'Integrate and setup traffic tracking tool',
							unit: 0.25,
							description: '',
						},
						{
							name: 'Integrate and setup a contact form',
							unit: 0.25,
							description: '',
						},
						{
							name: 'Invoice payment',
							unit: 0,
							tags: ['Admin'],
							description: '',
							type: 'INVOICE',
						},
					],
				},
			],
		},
		{
			name: 'LANDING',
			label: 'Landing page',
			sections: [
				{
					name: 'Before starting',
					items: [
						{
							name: 'Preparing Launch meeting',
							description:
								'Research on client and their values, update your portfolio, look for reference and trends in the client space.',
							type: 'PERSONAL',
							unit: 0.2,
							tags: ['Meeting'],
						},
						{
							name: 'Launch meeting',
							unit: 0.5,
							tags: ['Meeting'],
							description: '',
						},
						{
							name: '30% deposit payment',
							unit: 0,
							tags: ['Admin'],
							description: '',
							type: 'INVOICE',
						},
						{
							name: 'Benchmark',
							unit: 0.25,
							description: '',
						},
						{
							name: 'Requirements gathering',
							unit: 0.5,
							description: '',
						},
						{
							name: 'Requirements validation',
							unit: 0,
							tags: ['Important'],
							description: '',
							type: 'CUSTOMER',
						},
						{
							name: 'Moodboard',
							unit: 0.5,
							description: '',
						},
					],
				},
				{
					name: 'Design',
					items: [
						{
							name:
								'Designing the wireframes of the landing page main sections',
							unit: 1,
							description: '',
						},
						{
							name: 'Wireframe validation',
							unit: 0.5,
							tags: ['Important'],
							description:
								'1 back-and-forth based on feedback from the client',
							type: 'CUSTOMER',
						},
						{
							name: 'Send all the content needed (images + text)',
							unit: 0,
							description: `

	# content-acquisition-list
	- [ ] vector logo
	- [ ] text content
	- [ ] HD images`,
							type: 'CONTENT_ACQUISITION',
						},
						{
							name: 'Artistic direction',
							unit: 1,
							description: '',
						},
						{
							name: 'Artistic direction validation',
							tags: ['Important'],
							unit: 1,
							description:
								'2 back-and-forth base on feedback from the client accounted for',
							type: 'CUSTOMER',
						},
						{
							name: 'Responsive mock up (1 breakpoint at 1024px)',
							unit: 1,
							description: '',
						},
					],
				},
				{
					name: 'Development',
					items: [
						{
							name: 'Domain name configuration + MySQL setup',
							unit: 0.25,
							description: '',
						},
						{
							name: 'CMS setup',
							unit: 0.25,
							description: '',
						},
						{
							name: 'Integration of the landing page',
							unit: 8,
							description: '',
						},
						{
							name: 'Responsive design (1 breakpoint at 1024px)',
							unit: 1,
							description: '',
						},
					],
				},
				{
					name: 'Tests, fixes and release',
					items: [
						{
							name: 'Web browser compatibility',
							unit: 0.5,
							description: '',
						},
						{
							name: 'Acceptance tests and fixes',
							unit: 0.5,
							description: '',
						},
						{
							name: 'Final validation',
							tags: ['Important'],
							unit: 0,
							description: '',
							type: 'CUSTOMER',
						},
						{
							name: 'Release',
							unit: 0,
							description: '',
						},
					],
				},
				{
					name: 'Misc',
					items: [
						{
							name:
								'Integrate and configure a traffic tracking software',
							unit: 0.25,
							description: '',
						},
						{
							name: 'Integrate and configure a contact form',
							unit: 0.25,
							description: '',
						},
						{
							name: 'Invoice payment',
							tags: ['Admin'],
							unit: 0,
							description: '',
							type: 'INVOICE',
						},
					],
				},
			],
		},
		{
			name: 'IDENTITY',
			label: 'Visual identity',
			sections: [
				{
					name: 'Before starting',
					items: [
						{
							name: 'Preparing Launch meeting',
							description:
								'Research on client and their values, update your portfolio, look for reference and trends in the client space.',
							type: 'PERSONAL',
							unit: 0.2,
							tags: ['Meeting'],
						},
						{
							name: 'Launch meeting',
							tags: ['Meeting'],
							unit: 0.5,
							description: '',
						},
						{
							name: '30% deposit payment',
							unit: 0,
							tags: ['Admin'],
							description: '',
							type: 'INVOICE',
						},
						{
							name: 'Benchmark',
							unit: 0.5,
							description: '',
						},
						{
							name: 'Requirements and company values gathering',
							unit: 1,
							description: '',
						},
						{
							name: 'Requirements validation',
							tags: ['Important'],
							unit: 0,
							description: '',
							type: 'CUSTOMER',
						},
						{
							name: 'Moodboard',
							unit: 0.5,
							description: '',
						},
					],
				},
				{
					name: 'Design',
					items: [
						{
							name: 'Creating 3 creative leads',
							unit: 3,
							description: '',
						},
						{
							name: 'Validation of one of the lead',
							tags: ['Important'],
							unit: 0,
							description: '',
							type: 'CUSTOMER',
						},
						{
							name:
								'Creating a proposition based on the lead selected',
							unit: 1,
							description: '',
						},
						{
							name: 'Validation of the proposition',
							tags: ['Important'],
							unit: 1,
							description:
								'2 back-and-forths based on feedback from the client accounted for',
							type: 'CUSTOMER',
						},
						{
							name:
								'Creating 2 variations of the logo (colors and black and white)',
							unit: 0.25,
							description: '',
						},
						{
							name:
								'Preparing the files in the format needed for print and web use',
							unit: 0.25,
							description: '',
						},
					],
				},
				{
					name: 'Misc',
					items: [
						{
							name: 'Designing a visual identity charter',
							unit: 1,
							description: '',
						},
						{
							name: 'Invoice payment',
							tags: ['Admin'],
							unit: 0,
							description: '',
							type: 'INVOICE',
						},
					],
				},
			],
		},
		{
			name: 'MOTION',
			label: '1 min motion design',
			sections: [
				{
					name: 'Before starting',
					items: [
						{
							name: 'Preparing Launch meeting',
							description:
								'Research on client and their values, update your portfolio, look for reference and trends in the client space.',
							type: 'PERSONAL',
							unit: 0.2,
							tags: ['Meeting'],
						},
						{
							name: 'Launch meeting',
							tags: ['Rdv'],
							unit: 0.5,
							description: '',
						},
						{
							name: '30% deposit payment',
							tags: ['Admin'],
							unit: 0,
							description: '',
							type: 'INVOICE',
						},
						{
							name: 'Benchmark',
							unit: 0.5,
							description: '',
						},
						{
							name: 'Requirements gathering',
							unit: 1,
							description: '',
						},
						{
							name: 'Requirements validation',
							tags: ['Important'],
							unit: 0,
							description: '',
							type: 'CUSTOMER',
						},
						{
							name: 'Moodboard',
							unit: 0.5,
							description: '',
						},
					],
				},
				{
					name: 'Storyboard',
					items: [
						{
							name: 'Storyboard sketch',
							unit: 0.5,
							description: 'Deliverable: 1 .pdf file',
						},
						{
							name: 'Storyboard validation',
							tags: ['Important'],
							unit: 0,
							type: 'CUSTOMER',
						},
						{
							name: 'Detailed storyboard',
							unit: 1,
							description: 'Deliverable: 1 .pdf file',
						},
						{
							name: 'Detailed storyboard validation',
							tags: ['Important'],
							unit: 0.75,
							description:
								'2 back-and-forths based on client feedback are accounted for',
							type: 'CUSTOMER',
						},
					],
				},
				{
					name: 'Production',
					items: [
						{
							name:
								'Design and production of the different key frames',
							unit: 2,
							description: '',
						},
						{
							name: 'Key frames composition and style validation',
							tags: ['Important'],
							unit: 1,
							description:
								'2 back-and-forths based on client feedback are accounted for',
							type: 'CUSTOMER',
						},
						{
							name: 'Frame animation',
							unit: 3,
							description: '',
						},
						{
							name: 'Animation validation',
							tags: ['Important'],
							unit: 0.5,
							description:
								'1 back-and-forth based on client feedback is accounted for',
							type: 'CUSTOMER',
						},
					],
				},
				{
					name: 'Misc',
					items: [
						{
							name: 'Subtitles and soundtrack gathering ',
							unit: 0,
							description: `

	# content-acquisition-list
	- [ ] subtitles
	- [ ] soundtrack`,
							type: 'CONTENT_ACQUISITION',
						},
						{
							name: 'Integrate subtitle and soundtrack',
							unit: 1,
							description: '',
						},
						{
							name: 'Edit validation',
							tags: ['Important'],
							unit: 0.25,
							description:
								'Deliverable: 1 .mp4 SD file\n\n1 back-and-forth based on client feedback is accounted for',
							type: 'CUSTOMER',
						},
						{
							name: 'Encoding and delivery of HD file',
							unit: 0.25,
							description: 'Deliverable: 1 .mp4 HD file',
						},
						{
							name: 'Invoice payment',
							unit: 0,
							description: '',
							type: 'INVOICE',
						},
					],
				},
			],
		},
		{
			name: 'CARD',
			label: 'Business card',
			sections: [
				{
					name: 'Before starting',
					items: [
						{
							name: 'Preparing Launch meeting',
							type: 'PERSONAL',
							unit: 0.1,
							tags: ['Meeting'],
							description:
								'Research on client and their values, update your portfolio, look for reference and trends in the client space.',
						},
						{
							name: 'Launch meeting',
							unit: 0.1,
							tags: ['Meeting'],
							description: '',
						},
						{
							name: 'Creating quote and writing requirements',
							unit: 0.1,
							description: '',
						},
						{
							name: 'Validation of the requirements',
							unit: 0,
							tags: ['Important'],
							description: '',
							type: 'CUSTOMER',
						},
						{
							name: '30% deposit',
							unit: 0,
							tags: ['Admin'],
							description: '',
							type: 'INVOICE',
						},
					],
				},
				{
					name: 'Business card creation',
					items: [
						{
							name: 'Research and conception',
							unit: 0.25,
							description: 'Benchmarking and visual research',
							tags: ['Design'],
						},
						{
							name: 'Creation of 2 visual leads',
							unit: 0.25,
							tags: ['Design'],
						},
						{
							name: 'Design pitch',
							unit: 0.1,
							description:
								'Pitch of the 2 visual leads to the client',
						},
						{
							name: 'Choosing a lead',
							unit: 0,
							description:
								'The client choose a lead so it can be finalized',
							type: 'CUSTOMER',
						},
						{
							name: 'Finalization and feedback',
							unit: 0.25,
							description:
								'Finalization of the lead chosen by the client. 2 back and forth allowed. Asking for a whole new concept might lead to an update of the quote.',
							tags: ['Design'],
						},
						{
							name: 'Validation of the final version',
							unit: 0,
							type: 'CUSTOMER',
							tags: ['Important'],
						},
					],
				},
				{
					name: 'Deliverables and payment',
					items: [
						{
							name: 'Create a client file',
							unit: 0.05,
							description:
								'The file contains all the research done during the project, the administrative documents and the deliverables',
						},
						{
							name: 'Send the deliverables ready for printing',
							unit: 0.05,
							description: '300DPI .PDF HD files.',
						},
						{
							name: 'Invoice creation',
							unit: 0,
							tags: ['Admin'],
						},
						{
							name: 'Invoice payment',
							unit: 0,
							type: 'INVOICE',
							tags: ['Admin'],
						},
					],
				},
			],
		},
		{
			name: 'FACEBOOK_AD',
			label: 'Facebook ad banner',
			sections: [
				{
					name: 'Before starting',
					items: [
						{
							name: 'Preparing Launch meeting',
							type: 'PERSONAL',
							unit: 0.1,
							tags: ['Meeting'],
							description:
								'Research on client and their values, update your portfolio, look for reference and trends in the client space.',
						},
						{
							name: 'Launch meeting',
							unit: 0.1,
							tags: ['Meeting'],
							description: '',
						},
						{
							name: 'Creating quote and writing requirements',
							unit: 0.2,
							description: '',
						},
						{
							name: 'Validation of the requirements',
							unit: 0,
							tags: ['Important'],
							description: '',
							type: 'CUSTOMER',
						},
						{
							name: '30% deposit',
							unit: 0,
							tags: ['Admin'],
							description: '',
							type: 'INVOICE',
						},
					],
				},
				{
					name: "Visuals' conception",
					items: [
						{
							name: 'Research on target and benchmark',
							unit: 0.2,
							description: `Who is the target of the ad ? What kind of visuals works for this target.
Benchmark other ads on said target and research reference on specialized website (https://adespresso.com/blog/facebook-ad-types-collection-ads-carousel/).`,
							tags: ['Research'],
						},
						{
							name: 'Creation of 2 ad leads (3 visuals each)',
							unit: 0.8,
							description:
								'Create the ads with respect to facebook ads guideline (https://www.facebook.com/business/ads-guide/image)',
							tags: ['Design'],
						},
						{
							name: 'Verify image conformity',
							unit: 0.05,
							description:
								'Facebook has a strict policy on text in images. Here is a tool to test images conformity (https://www.facebook.com/ads/tools/text_overlay)',
							tags: ['Design'],
						},
						{
							name: 'Design pitch',
							unit: 0.1,
							description:
								'Pitch of the 2 ad leads to the client',
						},
						{
							name: 'Choose one of the 2 ad leads',
							unit: 0,
							type: 'CUSTOMER',
						},
						{
							name: 'Lead modification',
							unit: 0.1,
							description:
								'Modification of the lead on client feedback',
							tags: ['Design'],
						},
						{
							name: 'Validation of the final version',
							unit: 0,
							type: 'CUSTOMER',
							tags: ['Important'],
						},
					],
				},
				{
					name: 'Deliverables and payment',
					items: [
						{
							name: 'Create a client file',
							unit: 0.05,
							description:
								'The file contains all the research done during the project, the administrative documents and the deliverables',
						},
						{
							name: 'Send the deliverables ready to post',
							unit: 0.05,
							description: '75DPI .PNG or .JPG files.',
						},
						{
							name: 'Invoice creation',
							unit: 0,
							tags: ['Admin'],
						},
						{
							name: 'Invoice payment',
							unit: 0,
							type: 'INVOICE',
							tags: ['Admin'],
						},
					],
				},
			],
		},
		{
			name: 'FLYER_A5',
			label: 'A5 format flyer',
			sections: [
				{
					name: 'Before starting',
					items: [
						{
							name: 'Preparing Launch meeting',
							type: 'PERSONAL',
							description:
								'Research on client and their values, update your portfolio, look for reference and trends in the client space.',
							unit: 0.1,
							tags: ['Meeting'],
						},
						{
							name: 'Launch meeting',
							unit: 0.2,
							tags: ['Meeting'],
							description: '',
						},
						{
							name: 'Creating quote and writing requirements',
							unit: 0.2,
							description: '',
						},
						{
							name: 'Validation of the requirements',
							unit: 0,
							tags: ['Important'],
							description: '',
							type: 'CUSTOMER',
						},
						{
							name: '30% deposit',
							unit: 0,
							tags: ['Admin'],
							description: '',
							type: 'INVOICE',
						},
					],
				},
				{
					name: 'Creation of A5 flyer',
					items: [
						{
							name: 'Research and conception',
							unit: 0.7,
							description: 'Benchmarking and visual research',
							tags: ['Design'],
						},
						{
							name: 'Create to 2 leads',
							unit: 0.7,
							tags: ['Design'],
						},
						{
							name: 'Design pitch',
							unit: 0.1,
							description: 'Pitch of the 2 leads to the client',
						},
						{
							name: 'Client choice of one of the 2 leads',
							unit: 0.1,
							description: 'Pitch of the 2 leads to the client',
							type: 'CUSTOMER',
						},
						{
							name: 'Finalization and feedback',
							unit: 0.4,
							description:
								'Finalization of the lead chosen by the client. 2 back and forth allowed. Asking for a whole new concept might lead to an update of the quote.',
							tags: ['Design'],
						},
						{
							name: 'Validation of the final version',
							unit: 0,
							type: 'CUSTOMER',
							tags: ['Important'],
						},
					],
				},
				{
					name: 'Deliverables and payment',
					items: [
						{
							name: 'Create a client file',
							unit: 0.05,
							description:
								'The file contains all the research done during the project, the administrative documents and the deliverables',
						},
						{
							name: 'Send the deliverables ready for printing',
							unit: 0.05,
							description: '300DPI .PDF HD in A5 format',
						},
						{
							name: 'Invoice creation',
							unit: 0,
							tags: ['Admin'],
						},
						{
							name: 'Invoice payment',
							unit: 0,
							type: 'INVOICE',
							tags: ['Admin'],
						},
					],
				},
			],
		},
		{
			name: 'TRANSLATION',
			label: 'Translation',
			sections: [
				{
					name: 'Before starting',
					items: [
						{
							name: 'Preparing Launch meeting',
							description:
								'Research on client and their values, update your portfolio, look for reference and trends in the client space.',
							type: 'PERSONAL',
							unit: 0.2,
							tags: ['Meeting'],
						},
						{
							name: 'Launch meeting',
							unit: 0.4,
							tags: ['Meeting'],
							description: '',
						},
						{
							name: 'Creating quote and writing requirements',
							unit: 1,
							description:
								'Define all the step of the work to be done.',
						},
						{
							name: 'Validation of the requirements',
							unit: 0,
							tags: ['Important'],
							description: '',
							type: 'CUSTOMER',
						},
						{
							name: '30% deposit',
							unit: 0,
							tags: ['Admin'],
							description: '',
							type: 'INVOICE',
						},
					],
				},
				{
					name: 'Translation',
					items: [
						{
							name: 'Moodboard',
							unit: 2,
							description:
								'Create a file containing all the information about the editorial line of the client (voice, specific vocab, keywords, SEO requirements, etc.)',
						},
						{
							name:
								'Document, linguistic et terminology research',
							unit: 0.8,
							description:
								'This is setup phase of the translation.',
							tags: ['Translation'],
						},
						{
							name: 'First translation',
							unit: 1,
							tags: ['Translation'],
						},
						{
							name: 'First reading',
							unit: 0.5,
							tags: ['Translation'],
						},
						{
							name: 'Final version',
							unit: 1,
							tags: ['Translation'],
						},
						{
							name: 'Final reading',
							unit: 0.5,
							tags: ['Translation'],
						},
						{
							name: 'Validation',
							unit: 0,
							description:
								'Send a first version and feedback allowed for minor changes',
							type: 'CUSTOMER',
							tags: ['Important'],
						},
					],
				},
				{
					name: 'Deliverables and payment',
					items: [
						{
							name: 'Create a client file',
							unit: 0.05,
							description:
								'The file contains all the research done during the project, the administrative documents and the deliverables',
						},
						{
							name: 'Send the deliverables',
							unit: 0.05,
						},
						{
							name: 'Invoice creation',
							unit: 0,
							tags: ['Admin'],
						},
						{
							name: 'Invoice payment',
							unit: 0,
							type: 'INVOICE',
							tags: ['Admin'],
						},
					],
				},
			],
		},
		{
			name: 'BLANK',
			label: 'Basic',
			sections: [
				{
					name: 'Before starting',
					items: [
						{
							name: 'Launch meeting',
							tags: ['Rdv'],
							unit: 0.5,
							description: '',
						},
						{
							name: '30% deposit payment',
							tags: ['Admin'],
							unit: 0,
							description: '',
							type: 'INVOICE',
						},
					],
				},
				{
					name: 'Change the name of this section',
					items: [
						{
							name: 'Change the name of this task',
							unit: 0,
							description: '',
						},
					],
				},
				{
					name: 'Misc',
					items: [
						{
							name: 'Invoice payment',
							tags: ['Admin'],
							unit: 0,
							description: '',
							type: 'INVOICE',
						},
					],
				},
			],
		},
	],
	fr: [
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
								"Si vous ne l'avez pas encore fait, c'est le moment de contacter vos clients précédents pour que ceux-ci recommandent vos compétences sur Linkedin et sur votre expérience commune.",
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
								"La communauté Inyo grandit de jours en jours et compte des freelances aux nombreuses compétences: design graphique, développement, conception/rédaction, traduction, etc. N'hésitez pas à poster une annonce sur le [Slack](https://join.slack.com/t/inyo-freelancers/shared_invite/enQtNTgzNzA2NjI0NzcyLWM1MmYwMzM5NGVlMmI3MDU0N2U0MDEwYzk2OTViMGJlYzk3MmE1ZWYzZjkzNjFmMzU0OWFkNzYxNjVjYzBiOTk) pour proposer vos services ou échanger vos bonnes pratiques!\n\n[Me connecter à la communauté Inyo](https://inyo-freelancers.slack.com)",
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
							name: 'Préparer le rendez-vous de lancement',
							unit: 0.1,
							tags: ['Meeting'],
							type: 'PERSONAL',
							description:
								"Se renseigner sur le client et l'univers de son entreprise, mettre à jour son book, faire un tour des tendances actuelles sur les conceptions graphiques dans l'univers du client.",
						},
						{
							name: 'Réunion de lancement',
							unit: 0.5,
							tags: ['Rdv'],
							description: '',
						},
						{
							name: 'Paiement acompte de 30%',
							unit: 0,
							tags: ['Admin'],
							description: '',
							type: 'INVOICE',
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
							tags: ['Important'],
							description: '',
							type: 'CUSTOMER',
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
							tags: ['Important'],
							unit: 0.5,
							description:
								'1 aller-retour corrections est prévu dans la proposition commerciale',
							type: 'CUSTOMER',
						},
						{
							name:
								'Envoi de l’ensemble des contenus textes + images',
							unit: 0,
							description: `

	# content-acquisition-list
	- [ ] Logo vectoriel
	- [ ] Contenus menu principal
	- [ ] Contenus textes
	- [ ] Visuels HD`,
							type: 'CONTENT_ACQUISITION',
						},
						{
							name: 'Direction artistique',
							unit: 2,
							description: '',
						},
						{
							name: 'Validation de la direction artistique',
							unit: 1,
							tags: ['Important'],
							description:
								'2 allers-retours corrections sont prévus dans la proposition commerciale',
							type: 'CUSTOMER',
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
							tags: ['Important'],
							description: '',
							type: 'CUSTOMER',
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
							name:
								'Intégration et configuration d’un outil de suivi de trafic',
							unit: 0.25,
							description: '',
						},
						{
							name:
								'Intégration et configuration d’un formulaire de contact',
							unit: 0.25,
							description: '',
						},
						{
							name: 'Paiement facture',
							tags: ['Admin'],
							unit: 0,
							description: '',
							type: 'INVOICE',
						},
					],
				},
			],
		},
		{
			name: 'LANDING',
			label: 'Landing page',
			sections: [
				{
					name: 'Pré-projet',
					items: [
						{
							name: 'Préparer le rendez-vous de lancement',
							unit: 0.1,
							tags: ['Meeting'],
							type: 'PERSONAL',
							description:
								"Se renseigner sur le client et l'univers de son entreprise, mettre à jour son book, faire un tour des tendances actuelles sur les conceptions graphiques dans l'univers du client.",
						},
						{
							name: 'Réunion de lancement',
							tags: ['Rdv'],
							unit: 0.5,
							description: '',
						},
						{
							name: 'Paiement acompte de 30%',
							tags: ['Admin'],
							unit: 0,
							description: '',
							type: 'INVOICE',
						},
						{
							name: 'Benchmark',
							unit: 0.25,
							description: '',
						},
						{
							name: "Rédaction d'un cahier des charges",
							unit: 0.5,
							description: '',
						},
						{
							name: 'Validation du cahier des charges',
							unit: 0,
							tags: ['Important'],
							description: '',
							type: 'CUSTOMER',
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
							name:
								'Wireframe des principales sections de la landing page',
							unit: 1,
							description: '',
						},
						{
							name: 'Validation du wireframe des sections',
							unit: 0.5,
							tags: ['Important'],
							description:
								'1 aller-retour corrections est prévu dans la proposition commerciale',
							type: 'CUSTOMER',
						},
						{
							name:
								'Envoi de l’ensemble des contenus textes + images',
							unit: 0,
							description: `

	# content-acquisition-list
	- [ ] Logo vectoriel
	- [ ] Contenus textes
	- [ ] Visuels HD`,
							type: 'CONTENT_ACQUISITION',
						},
						{
							name: 'Direction artistique',
							unit: 1,
							description: '',
						},
						{
							name: 'Validation de la direction artistique',
							unit: 1,
							tags: ['Important'],
							description:
								'2 allers-retours corrections sont prévus dans la proposition commerciale',
							type: 'CUSTOMER',
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
							name: 'Compatibilité navigateurs',
							unit: 0.5,
							description: '',
						},
						{
							name: 'Tests (Phase de recette) et corrections',
							unit: 0.5,
							description: '',
						},
						{
							name: 'Validation finale de la landing page',
							tags: ['Important'],
							unit: 0,
							description: '',
							type: 'CUSTOMER',
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
							name:
								'Intégration et configuration d’un outil de suivi de trafic',
							unit: 0.25,
							description: '',
						},
						{
							name:
								'Intégration et configuration d’un formulaire de contact',
							unit: 0.25,
							description: '',
						},
						{
							name: 'Paiement facture',
							tags: ['Admin'],
							unit: 0,
							description: '',
							type: 'INVOICE',
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
							name: 'Préparer le rendez-vous de lancement',
							unit: 0.1,
							tags: ['Meeting'],
							type: 'PERSONAL',
							description:
								"Se renseigner sur le client et l'univers de son entreprise, mettre à jour son book, faire un tour des tendances actuelles sur les conceptions graphiques dans l'univers du client.",
						},
						{
							name: 'Réunion de lancement',
							tags: ['Rdv'],
							unit: 0.5,
							description: '',
						},
						{
							name: 'Paiement acompte de 30%',
							tags: ['Admin'],
							unit: 0,
							description: '',
							type: 'INVOICE',
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
							tags: ['Important'],
							unit: 0,
							description: '',
							type: 'CUSTOMER',
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
							tags: ['Important'],
							unit: 0,
							description: '',
							type: 'CUSTOMER',
						},
						{
							name: "Mise au point de l'axe retenu",
							unit: 1,
							description: '',
						},
						{
							name: 'Validation',
							tags: ['Important'],
							unit: 1,
							description:
								'2 allers-retours corrections sont prévus dans la proposition commerciale',
							type: 'CUSTOMER',
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
							name:
								'Conception charte graphique utilisation logo',
							unit: 1,
							description: '',
						},
						{
							name: 'Paiement facture',
							tags: ['Admin'],
							unit: 0,
							description: '',
							type: 'INVOICE',
						},
					],
				},
			],
		},
		{
			name: 'MOTION',
			label: 'Motion design 1 min',
			sections: [
				{
					name: 'Pré-projet',
					items: [
						{
							name: 'Préparer le rendez-vous de lancement',
							unit: 0.1,
							tags: ['Meeting'],
							type: 'PERSONAL',
							description:
								"Se renseigner sur le client et l'univers de son entreprise, mettre à jour son book, faire un tour des tendances actuelles sur les conceptions graphiques dans l'univers du client.",
						},
						{
							name: 'Réunion de lancement',
							tags: ['Rdv'],
							unit: 0.5,
							description: '',
						},
						{
							name: 'Paiement acompte de 30%',
							tags: ['Admin'],
							unit: 0,
							description: '',
							type: 'INVOICE',
						},
						{
							name: 'Benchmark',
							unit: 0.5,
							description: '',
						},
						{
							name: "Rédaction d'un cahier des charges",
							unit: 1,
							description: '',
						},
						{
							name: 'Validation du cahier des charges',
							unit: 0,
							tags: ['Important'],
							description: '',
							type: 'CUSTOMER',
						},
						{
							name: 'Moodboard',
							unit: 0.5,
							description: '',
						},
					],
				},
				{
					name: 'Storyboard',
					items: [
						{
							name: 'Storyboard crayonné',
							unit: 0.5,
							description: 'Livraison: 1 fichier .pdf',
						},
						{
							name: 'Validation du storyboard crayonné',
							tags: ['Important'],
							unit: 0,
							description:
								'Nous cherchons à valider ici les grandes étapes et plans principaux du scenario',
							type: 'CUSTOMER',
						},
						{
							name: 'Storyboard avancé',
							unit: 1,
							description: 'Livraison: 1 fichier .pdf',
						},
						{
							name: 'Validation du storyboard détaillé',
							tags: ['Important'],
							unit: 0.75,
							description:
								'2 allers-retours corrections sont prévus dans la proposition commerciale',
							type: 'CUSTOMER',
						},
					],
				},
				{
					name: 'Production',
					items: [
						{
							name: 'Conception et production des images clefs',
							unit: 2,
							description: '',
						},
						{
							name: 'Validation du style et des images clefs',
							tags: ['Important'],
							unit: 1,
							description:
								'2 allers-retours corrections sont prévus dans la proposition commerciale',
							type: 'CUSTOMER',
						},
						{
							name: 'Animation des écrans',
							unit: 3,
							description: '',
						},
						{
							name: 'Validation de l’animation',
							tags: ['Important'],
							unit: 0.5,
							description:
								'1 aller-retour est prévu dans la proposition commerciale',
							type: 'CUSTOMER',
						},
					],
				},
				{
					name: 'Divers',
					items: [
						{
							name:
								'Récupération des sous-titres et bande son à intégrer',
							unit: 0,
							description: `

	# content-acquisition-list
	- [ ] Contenus texte
	- [ ] Données temporelles
	- [ ] Bande son`,
							type: 'CONTENT_ACQUISITION',
						},
						{
							name:
								'Intégration des sous-titres et de la bande son',
							unit: 1,
							description: '',
						},
						{
							name: 'Validation de l’ensemble du montage',
							unit: 0.25,
							tags: ['Important'],
							description:
								'Livraison .mp4 BD - 1 allers-retours sont prévus dans la proposition commerciale',
							type: 'CUSTOMER',
						},
						{
							name: 'Encodage et livraison des fichiers HD',
							unit: 0.25,
							description: 'Livraison .mp4 HD',
						},
						{
							name: 'Paiement facture',
							tags: ['Admin'],
							unit: 0,
							description: '',
							type: 'INVOICE',
						},
					],
				},
			],
		},
		{
			name: 'CARD',
			label: 'Création carte de visite',
			sections: [
				{
					name: 'Pré-projet',
					items: [
						{
							name: 'Préparer le rendez-vous de lancement',
							unit: 0.1,
							tags: ['Meeting'],
							type: 'PERSONAL',
							description:
								"Se renseigner sur le client et l'univers de son entreprise, mettre à jour son book, faire un tour des tendances actuelles sur les conceptions graphiques dans l'univers du client.",
						},
						{
							name: 'Rendez-vous de lancement',
							unit: 0.1,
							tags: ['Meeting'],
							description: '',
						},
						{
							name: 'Ecrire le devis et le cahier des charges',
							unit: 0.1,
							description: '',
						},
						{
							name: 'Validation du devis',
							unit: 0,
							tags: ['Important'],
							description: '',
							type: 'CUSTOMER',
						},
						{
							name: "Paiement de l'acompte de 30%",
							unit: 0,
							tags: ['Admin'],
							description: '',
							type: 'INVOICE',
						},
					],
				},
				{
					name: 'Conception carte de visite',
					items: [
						{
							name: 'Recherche',
							unit: 0.25,
							description:
								"Recherche des tendances actuelles, recherche d'images.",
							tags: ['Design'],
						},
						{
							name: 'Création de 2 pistes visuelles',
							unit: 0.25,
							tags: ['Design'],
						},
						{
							name: 'Rendez-vous client de présentation',
							unit: 0.1,
							description: 'Présentation des 2 pistes créatives.',
						},
						{
							name: "Validation d'un visuel",
							unit: 0,
							description:
								'Le visuel choisi pourra être modifié par la suite.',
							type: 'CUSTOMER',
						},
						{
							name: 'Finalisation et aller-retours',
							unit: 0.25,
							description:
								'Finalisation de la piste et aller-retours suivant les commentaires du client. Seules les modifications mineures sont prises en compte. Si une création totalement nouvelle est demandée et implique le dépassement du temps prévu, un ajustement du devis devra être fait.',
							tags: ['Design'],
						},
						{
							name: 'Validation de la version finale',
							unit: 0,
							type: 'CUSTOMER',
							tags: ['Important'],
						},
					],
				},
				{
					name: 'Livrables et paiement',
					items: [
						{
							name: "Préparation d'un dossier client",
							unit: 0.05,
							type: 'PERSONAL',
							description:
								'Dossier récapitulatif comprenant les informations collectées pour la réalisation, les documents administratifs et les réalisations finales.',
						},
						{
							name: 'Envoi des livrables prêt à imprimer',
							unit: 0.05,
							description:
								'.PDF HD (Recto/Verso) - Format standard - 300 DPI',
						},
						{
							name: 'Rédaction de la facture',
							unit: 0,
							description:
								"Facture comprenant la déduction de l'acompte de 30% déjà payé.",
							tags: ['Admin'],
							type: 'PERSONAL',
						},
						{
							name: 'Paiement facture',
							unit: 0,
							type: 'INVOICE',
							tags: ['Admin'],
						},
					],
				},
			],
		},
		{
			name: 'FACEBOOK_AD',
			label: 'Création de visuels Facebook ads',
			sections: [
				{
					name: 'Pré-projet',
					items: [
						{
							name: 'Préparer le rendez-vous de lancement',
							unit: 0.1,
							tags: ['Meeting'],
							type: 'PERSONAL',
							description:
								"Se renseigner sur le client et l'univers de son entreprise, mettre à jour son book, faire un tour des tendances actuelles sur les conceptions graphiques dans l'univers du client.",
						},
						{
							name: 'Rendez-vous de lancement',
							unit: 0.1,
							tags: ['Meeting'],
							description: '',
						},
						{
							name: 'Ecrire le devis et le cahier des charges',
							unit: 0.2,
							description: '',
						},
						{
							name: 'Validation du devis',
							unit: 0,
							tags: ['Important'],
							description: '',
							type: 'CUSTOMER',
						},
						{
							name: "Paiement de l'acompte de 30%",
							unit: 0,
							tags: ['Admin'],
							description: '',
							type: 'INVOICE',
						},
					],
				},
				{
					name: 'Conception des visuels',
					items: [
						{
							name:
								'Recherches sur la cible de la publicité, Benchmark',
							unit: 0.2,
							description: `Quelle est l'audience ciblée par la publicité? Quel type de visuel fonctionne avec cette cible.
Recherches, consultation de sites spécialisés pour connaitre les performances des visuels par rapport à la cible (https://adespresso.com/blog/facebook-ad-types-collection-ads-carousel/)`,
							tags: ['Research'],
						},
						{
							name: 'Création de 2 séries de 3 visuels',
							unit: 0.8,
							description:
								'Création en accord avec les textes de la publicité Facebook, et selon les formats imposés par Facebook (https://www.facebook.com/business/ads-guide/image)',
							tags: ['Design'],
						},
						{
							name:
								"Vérification pourcentage de texte dans l'image",
							unit: 0.05,
							description:
								'Les images comportant plus de 20% de texte peuvent être moins diffusées. (https://www.facebook.com/ads/tools/text_overlay)',
							tags: ['Design'],
						},
						{
							name: "Validation et choix d'une série de visuels",
							unit: 0,
							description:
								'Les visuels choisis pourront être modifiés par la suite.',
							type: 'CUSTOMER',
						},
						{
							name: 'Rendez-vous client de présentation',
							unit: 0.1,
							description: 'Présentation des 2 pistes créatives.',
						},
						{
							name: 'Modifications simples',
							unit: 0.1,
							description: `Les modifications simples comprennent le positionnement d'un ou plusieurs objets, la couleur ou la taille.
Si une création totalement nouvelle est demandée et implique le dépassement du temps prévu, un ajustement du devis devra être fait.`,
							tags: ['Design'],
						},
						{
							name: 'Validation finale',
							unit: 0,
							type: 'CUSTOMER',
							tags: ['Important'],
						},
					],
				},
				{
					name: 'Livrables et paiement',
					items: [
						{
							name: "Préparation d'un dossier client",
							type: 'PERSONAL',
							unit: 0.05,
							description:
								'Dossier récapitulatif comprenant les informations collectées pour la réalisation, les documents administratifs et les réalisations finales.',
						},
						{
							name: 'Envoi des livrables prêt à poster',
							unit: 0.05,
							description: '75 DPI .PNG ou JPEG',
						},
						{
							name: 'Rédaction de la facture',
							type: 'PERSONAL',
							unit: 0,
							description:
								"Facture comprenant la déduction de l'acompte de 30% déjà payé.",
							tags: ['Admin'],
						},
						{
							name: 'Paiement facture',
							unit: 0,
							type: 'INVOICE',
							tags: ['Admin'],
						},
					],
				},
			],
		},
		{
			name: 'FLYER_A5',
			label: 'Flyer A5',
			sections: [
				{
					name: 'Pré-projet',
					items: [
						{
							name: 'Préparer le rendez-vous de lancement',
							type: 'PERSONAL',
							unit: 0.1,
							tags: ['Meeting'],
							description: '',
						},
						{
							name: 'Rendez-vous de lancement',
							unit: 0.2,
							tags: ['Meeting'],
							description: '',
						},
						{
							name: 'Ecrire le devis et le cahier des charges',
							unit: 0.2,
							description: '',
						},
						{
							name: 'Validation du devis',
							unit: 0,
							tags: ['Important'],
							description: '',
							type: 'CUSTOMER',
						},
						{
							name: "Paiement de l'acompte de 30%",
							unit: 0,
							tags: ['Admin'],
							description: '',
							type: 'INVOICE',
						},
					],
				},
				{
					name: 'Conception du Flyer A5',
					items: [
						{
							name: 'Recherche, Création',
							unit: 0.7,
							description:
								"Recherche des tendances actuelles, recherche d'images.",
							tags: ['Design'],
						},
						{
							name: 'Création de 2 visuels',
							unit: 0.7,
							tags: ['Design'],
						},
						{
							name: 'Rendez-vous client de présentation',
							unit: 0.1,
							description: 'Présentation des 2 pistes créatives.',
						},
						{
							name: "Validation d'un visuel",
							unit: 0.1,
							description:
								'Le visuel choisi pourra être modifié par la suite.',
							type: 'CUSTOMER',
						},
						{
							name: 'Modifications simples',
							unit: 0.4,
							description: `Les modifications simples comprennent le positionnement d'un ou plusieurs objets, la couleur ou la taille.
Si une création totalement nouvelle est demandée et implique le dépassement du temps prévu, un ajustement du devis devra être fait.`,
							tags: ['Design'],
						},
						{
							name: 'Validation finale',
							unit: 0,
							type: 'CUSTOMER',
							tags: ['Important'],
						},
					],
				},
				{
					name: 'Livrables et paiement',
					items: [
						{
							name: "Préparation d'un dossier client",
							type: 'PERSONAL',
							unit: 0.05,
							description:
								'Dossier récapitulatif comprenant les informations collectées pour la réalisation, les documents administratifs et les réalisations finales.',
						},
						{
							name: 'Envoi des livrables prêt à imprimer',
							unit: 0.05,
							description:
								'.PDF HD (Recto/Verso) - Format standard - 300 DPI',
						},
						{
							name: 'Rédaction de la facture',
							type: 'PERSONAL',
							unit: 0,
							description:
								"Facture comprenant la déduction de l'acompte de 30% déjà payé.",
							tags: ['Admin'],
						},
						{
							name: 'Paiement facture',
							unit: 0,
							type: 'INVOICE',
							tags: ['Admin'],
						},
					],
				},
			],
		},
		{
			name: 'TRANSLATION',
			label: 'Traduction',
			sections: [
				{
					name: 'Pré-projet',
					items: [
						{
							name: 'Préparer le rendez-vous de lancement',
							type: 'PERSONAL',
							unit: 0.2,
							tags: ['Meeting'],
							description: '',
						},
						{
							name: 'Rendez-vous de lancement',
							unit: 0.4,
							tags: ['Meeting'],
							description: '',
						},
						{
							name: 'Ecrire le devis et le cahier des charges',
							unit: 1,
							description:
								'Define all the step of the work to be done.',
						},
						{
							name: 'Validation du devis',
							unit: 0,
							tags: ['Important'],
							description: '',
							type: 'CUSTOMER',
						},
						{
							name: "Paiement de l'acompte de 30%",
							unit: 0,
							tags: ['Admin'],
							description: '',
							type: 'INVOICE',
						},
					],
				},
				{
					name: 'Traduction',
					items: [
						{
							name: 'Moodboard',
							unit: 2,
							description:
								'Compiler tous les critères de la ligne éditoriale (ton, vocabulaire spécifique, mots-clés, tendances SEO/site web, etc.).',
						},
						{
							name:
								'Recherche documentaire, linguistique et terminologique',
							unit: 0.8,
							description:
								"Recherche d'informations, de termes et de définitions. Cette étape set de phase préparatoire à la traduction.",
							tags: ['Translation'],
						},
						{
							name: 'Rédaction du premier jet',
							unit: 1,
							tags: ['Translation'],
						},
						{
							name: 'Première relecture',
							unit: 0.5,
							tags: ['Translation'],
						},
						{
							name: 'Rédaction de la version finale',
							unit: 1,
							tags: ['Translation'],
						},
						{
							name: 'Seconde relecture',
							unit: 0.5,
							tags: ['Translation'],
						},
						{
							name: 'Validation',
							unit: 0,
							description:
								"Envoi d'un premier fichier au client pour validation ou éventuels changements mineurs.",
							type: 'CUSTOMER',
							tags: ['Important'],
						},
					],
				},
				{
					name: 'Livrables et paiement',
					items: [
						{
							name: "Préparation d'un dossier client",
							type: 'PERSONAL',
							unit: 0.05,
							description:
								'Dossier récapitulatif comprenant les informations collectées pour la réalisation, les documents administratifs et les réalisations finales.',
						},
						{
							name: 'Envoi des livrables',
							unit: 0.05,
						},
						{
							name: 'Rédaction de la facture',
							type: 'PERSONAL',
							unit: 0,
							description:
								"Facture comprenant la déduction de l'acompte de 30% déjà payé.",
							tags: ['Admin'],
						},
						{
							name: 'Paiement facture',
							unit: 0,
							type: 'INVOICE',
							tags: ['Admin'],
						},
					],
				},
			],
		},
		{
			name: 'BLANK',
			label: 'Basique',
			sections: [
				{
					name: 'Pré-projet',
					items: [
						{
							name: 'Réunion de lancement',
							tags: ['Rdv'],
							unit: 0.5,
							description: '',
						},
						{
							name: 'Paiement acompte de 30%',
							tags: ['Admin'],
							unit: 0,
							description: '',
							type: 'INVOICE',
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
							name: 'Paiement facture',
							unit: 0,
							tags: ['Admin'],
							description: '',
							type: 'INVOICE',
						},
					],
				},
			],
		},
	],
};

export const onboardingTemplate = {
	en: {
		name: 'ONBOARDING',
		label: 'Onboarding',
		sections: [
			{
				name: 'For starters…',
				items: [
					{
						name: '✌️ Click on this task!',
						unit: 0,
						description:
							"### A fake project to help you understand Inyo \n\nLet's learn how to:\n* create tasks,\n* create projects,\n* change contents,\n* create client tasks,\n* use all the other features!\n\n Click on *Mark as done* to complete this task and let's go to the next one.",
					},
					{
						name: '✅ Create and validate your 1st task',
						unit: 0,
						description:
							"### An adaptive omnibar\n\nThe input at the top of the dashboard view allows you to create tasks, project and section.\n\nIf you start with '/' you can choose between différente type of task: task, client task, content acquisition task, and invoice payment. Create your first task and mark it as done!",
					},
					{
						name:
							"🙋 Drag and drop this task in dashboard's calendar to activate it",
						unit: 0,
						description:
							"### How do client task work? \n\nThis task is assigned to a client (in red), It means you need him for something (approval, content). Inyo will remind him automatically to ensure that you have everything you need in time. By activating it you'll see the reminders in your calendar. You'll be able to cancel them at any time. \n\nYou won't miss another deadline. \n\n### Edwige?\nThis task is assigned to 'Test client', she goes by Edwige and will complete this task once it's activated.",
						type: 'CUSTOMER',
					},
					{
						name: '✏️ Add a comment',
						unit: 0,
						description:
							"You can comment by using the text box below. Your client will receive an email and he'll be able to answer it. You'll be in turn notified of the comment. By centralising everything in the same place, You will avoid switching between different app and platform to find the information you need. \n\nAdd your first comment below.",
					},
				],
			},
			{
				name: '…Last but not least',
				items: [
					{
						name: '🚀 Create a new project by modifying a template',
						unit: 0.1,
						description:
							"## 🎉🎉🎉 \nYou've just learned how to use the tasks. Why not try to create a project by yourself now? \n\nTo help you, we provide base template that will make starting a new project a breeze: create a new project right now and start saving time!\n\n Just click on create a new project in the Projects page.\nYou can fill it up yourself or use a template.\n\nGo ahead try it now!",
					},
					{
						name: '🏆 Give this onboarding a rating',
						tags: ['Important'],
						unit: 0,
						description:
							"# Thank you 😍\n\nYou're ready to organize and manage all your projects, personal or professional. Send an email to Edwige - [edwige@inyo.me](mailto:edwige@inyo.me), your new *Smart Assistant*, or comment this task to rate your experience with Inyo, Thank you for trying Inyo!",
					},
				],
			},
		],
	},
	fr: {
		name: 'ONBOARDING',
		label: 'Onboarding',
		sections: [
			{
				name: 'Pour commencer…',
				items: [
					{
						name: '✌️ Cliquez sur cette tâche!',
						unit: 0,
						description:
							"### Un projet fictif pour vous aider à comprendre le fonctionnement \n\nBrièvement, nous allons voir comment:\n* créer des tâches,\n* créer des projets,\n* modifier les contenus,\n* créer des tâches clients,\n* et d'autres options qui vous seront très utiles!\n\n Cliquez sur *Marquer comme fait* pour valider celle-ci et passer aux suivantes.",
					},
					{
						name: '✅ Créez et validez votre 1ère tâche',
						unit: 0,
						description:
							"### Un champ de saisie multitâches \n\nLe champ de saisie en haut de la vue principale vous permet de créer de nouvelles tâches, de nouveaux projets et de nouvelles sections.\n\nLorsque vous commencez par un slash '/' vous pouvez choisir parmi les différents types de tâches: tâche personnelle, tâche client, tâche récupération de contenus. Appuyez sur *Tab* pour parcourir les options et pressez *entrée* pour valider.\n\nÀ vous de jouer, créez votre 1ère tâche et marquez celle-ci comme faîte!",
					},
					{
						name:
							"🙋 Glissez cette tâche dans le calendrier pour l'activer",
						unit: 0,
						description:
							"### Comment fonctionnent les tâches client? \n\nCette tâche est une tâche attribuée à votre client (couleur rouge), ce qui signifie que vous êtes en attente d'une action de sa part. Inyo va se charger de le relancer automatiquement pour s'assurer que celui-ci s'en charge en temps et en heure. En l’activant, vous verrez les rappels s'afficher dans votre calendrier et vous pouvez à tout moment les annuler. \n\nVous ne raterez plus aucune deadline 🎉\n\n### Edwige?\nCette tâche est attribuée au client 'Client test' et ce sera donc *Edwige de Inyo* qui se chargera de vous répondre!",
						type: 'CUSTOMER',
					},
					{
						name: '✏️ Ajoutez un commentaire',
						unit: 0,
						description:
							'Vous pouvez commenter une tâche via le champ de texte ci-dessous. Votre client recevra un email le notifiant de votre commentaire et pourra y répondre en accédant à la tâche. Vous serez notifié à votre tour par email. En centralisant tout au même endroit, vous vous évitez des allers-retours entre de multiples canaux pour retrouver des informations.\n\nAjoutez votre 1er commentaire en cliquant ci-dessous.',
					},
				],
			},
			{
				name: '…et pour finir',
				items: [
					{
						name:
							'🚀 Créez un nouveau projet en modifiant un modèle existant',
						unit: 0.1,
						description:
							"## 🎉🎉🎉 \nVous connaissez à présent les options de base pour créer un projet, il ne vous reste plus qu'à les appliquer! \n\nPour vous aider, nous proposons des modèles prédéfinis car nous savons que la création de projets est toujours une tâche fastidieuse: créez dès maintenant un projet et commencer à gagner du temps!\n\n Pour cela, il vous suffit de cliquer sur le bouton 'Créer un projet' dans la page Projet.\nVous pourrez ensuite créer des tâches ou choisir un modèle pré-rempli.\n\nÀ vous de jouer, créez votre premier projet!",
					},
					{
						name: '🏆 Donnez une note sur 10 à cet onboarding',
						tags: ['Important'],
						unit: 0,
						description:
							'# Merci 😍\n\nVous voilà paré·e pour maîtriser et organiser l’ensemble de vos projets, personnels comme professionnels. Envoyez un email à Edwige - [edwige@inyo.me](mailto:edwige@inyo.me), votre nouvel *Smart Assistant*, ou commentez cette tâche pour évaluer votre expérience avec Inyo, merci!',
					},
				],
			},
		],
	},
};
