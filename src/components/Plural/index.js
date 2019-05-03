export default function Plural({singular, plural, value}) {
	return Math.abs(value) > 1 ? plural : singular;
}
