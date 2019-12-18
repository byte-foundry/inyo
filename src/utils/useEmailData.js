import {useQuery} from './apollo-hooks';
import {GET_EMAIL_TYPES} from './queries';

const useEmailData = () => {
	const {data, loading, error} = useQuery(GET_EMAIL_TYPES);

	if (!data || !data.emailTypes || loading || error) {
		return {error};
	}

	const categories = [];

	data.emailTypes.forEach((type) => {
		let catIndex = categories.findIndex(c => c.name === type.category);

		if (catIndex === -1) {
			categories.push({
				name: type.category,
				types: [],
			});
			catIndex = categories.length - 1;
		}

		categories[catIndex].types.push(type);
	});
	return {
		categories,
	};
};

export default useEmailData;
