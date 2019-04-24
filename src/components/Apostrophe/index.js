export default function ({withVowel, withConsonant, value = ''}) {
	const startWithVowel = value
		.toLowerCase()
		.normalize('NFD')
		.match(/^[aiueo]/);

	return startWithVowel ? withVowel : withConsonant;
}
