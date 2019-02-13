import {GET_PROJECT_DATA_WITH_TOKEN, GET_PROJECT_DATA} from '../queries';

function updateItemGetProjectWithTokenData(
	cache,
	sectionId,
	projectId,
	item,
	token,
) {
	const data = cache.readQuery({
		query: GET_PROJECT_DATA_WITH_TOKEN,
		variables: {
			projectId,
			token,
		},
	});
	const section = data.project.sections.find(e => e.id === sectionId);
	const itemIndex = section.items.findIndex(e => e.id === item.id);

	section.items[itemIndex].status = item.status;

	cache.writeQuery({
		query: GET_PROJECT_DATA_WITH_TOKEN,
		variables: {
			projectId,
			token,
		},
		data,
	});
}

function updateItemGetProjectData(cache, sectionId, projectId, item) {
	const data = cache.readQuery({
		query: GET_PROJECT_DATA,
		variables: {
			projectId,
		},
	});
	const section = data.project.sections.find(e => e.id === sectionId);
	const itemIndex = section.items.findIndex(e => e.id === item.id);

	section.items[itemIndex].status = item.status;

	cache.writeQuery({
		query: GET_PROJECT_DATA,
		variables: {
			projectId,
		},
		data,
	});
}

export default ({
	itemMutation, itemId, sectionId, projectId, token,
}) => () => new Promise((resolve, reject) => {
	itemMutation({
		variables: {
			itemId,
			token,
		},
		update: (cache, {data: {finishItem: mutatedItem}}) => {
			try {
				updateItemGetProjectData(
					cache,
					sectionId,
					projectId,
					mutatedItem,
				);
				updateItemGetProjectWithTokenData(
					cache,
					sectionId,
					projectId,
					mutatedItem,
					token,
				);
			}
			catch (e) {
				reject(e);
			}

			resolve();
		},
	});
});
