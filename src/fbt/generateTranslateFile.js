const fs = require('fs');
const yargs = require('yargs');
const path = require('path');

const args = {
	SOURCE_STRINGS: 'source-strings',
	LOCALE: 'locale',
	OUT_DIRECTORY: 'out-directory',
	HELP: 'help',
};

const {argv} = yargs
	.usage('Generate or udpate a locale file with the proper skeleton')
	.string(args.SOURCE_STRINGS)
	.default(args.SOURCE_STRINGS, '.source_strings.json')
	.describe(
		args.SOURCE_STRINGS,
		'The fbt source string file. default to ".source_strings"',
	)
	.alias(args.SOURCE_STRINGS, 's')
	.string(args.LOCALE)
	.demand(args.LOCALE, 'locale is required')
	.describe(
		args.LOCALE,
		'locale of the translations to generate should be of the format xx-XX if you want to use navigator.language',
	)
	.alias(args.LOCALE, 'l')
	.string(args.OUT_DIRECTORY)
	.demand(args.OUT_DIRECTORY, 'output directory is required')
	.describe(
		args.LOCALE,
		'directory where the translation file will be generated',
	)
	.alias(args.OUT_DIRECTORY, 'o')
	.alias(args.HELP, 'h');

function extractHashToTexts(sourceStringsFile) {
	const {phrases} = JSON.parse(fs.readFileSync(sourceStringsFile));

	return phrases.map(phrase => phrase.hashToText);
}

function generateFile(locale, hashToTexts) {
	const content = {
		'fb-locale': locale,
		translations: {},
	};

	hashToTexts.forEach((hashToText) => {
		Object.keys(hashToText).forEach((hash) => {
			const text = hashToText[hash];

			content.translations[hash] = {
				tokens: [],
				types: [],
				translations: [
					{
						translation: `#TODO ${text}`,
						variations: {},
					},
				],
			};
		});
	});

	return content;
}

if (argv[args.HELP]) {
	yargs.showHelp();
	process.exit(0);
}

const hashToTexts = extractHashToTexts(argv[args.SOURCE_STRINGS]);
const newOutput = generateFile(argv[args.LOCALE], hashToTexts);
const outputFilePath = path.join(
	argv[args.OUT_DIRECTORY],
	`${argv[args.LOCALE]}.json`,
);

let output = newOutput;

try {
	const existingFile = JSON.parse(fs.readFileSync(outputFilePath));

	output = {
		...newOutput,
		translations: {
			...newOutput.translations,
			...existingFile.translations,
		},
	};
}
catch (e) {
	console.log('no existingFile');
}

fs.writeFileSync(
	path.join(argv[args.OUT_DIRECTORY], `${argv[args.LOCALE]}.json`),
	JSON.stringify(output, null, ' '),
);
