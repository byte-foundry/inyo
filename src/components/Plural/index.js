export default function Plural({singular, plural, value}) {
	return value > 1 ? plural : singular;
}
