export default {
	getAllTasks({mutation, query}) {
		const dataToUpdate = query.result;
		const {
			sectionId: endSectionId,
			position: endPosition,
		} = query.variables.sectionId;

		const itemsToUpdate = [mutation.result.data.updateItem];
		const oldItemsToUpdate = [];
		const section = sections.find(
			sectionItem => sectionItem.id === endSectionId,
		);
		const oldSection = sections.find(
			sectionItem => sectionItem.id === sectionId,
		);

		if (sectionId === endSectionId) {
			// task is drag and drop in the same section
			if (
				section.items.find(item => updateItem.id === item.id)
					.position !== endPosition
			) {
				section.items.forEach((item) => {
					if (
						item.position > startPosition
						&& item.position <= endPosition
					) {
						itemsToUpdate.push({
							...item,
							position: item.position - 1,
						});
					}
					else if (
						item.position < startPosition
						&& item.position >= endPosition
					) {
						itemsToUpdate.push({
							...item,
							position: item.position + 1,
						});
					}
				});

				console.table(itemsToUpdate);

				itemsToUpdate.forEach((itemUpdated) => {
					const indexTaskToUpdate = dataToUpdate.me.tasks.findIndex(
						t => itemUpdated.id === t.id,
					);

					dataToUpdate.me.tasks[indexTaskToUpdate].position
						= itemUpdated.position;
				});

				cache.writeQuery({
					query: GET_ALL_TASKS,
					data: dataToUpdate,
				});
			}
		}
		else {
			section.items.forEach((item) => {
				if (item.position >= endPosition) {
					itemsToUpdate.push({
						...item,
						position: item.position + 1,
					});
				}
			});

			oldSection.items.forEach((item) => {
				if (item.position >= startPosition) {
					oldItemsToUpdate.push({
						...item,
						position: item.position - 1,
					});
				}
			});

			oldSection.items.splice(position, 1);

			const sectionForItem = {
				...section,
				items: undefined,
			};

			const oldSectionForItem = {
				...oldSection,
				items: undefined,
			};

			oldItemsToUpdate.forEach((itemUpdated) => {
				const indexTaskToUpdate = dataToUpdate.me.tasks.findIndex(
					t => itemUpdated.id === t.id,
				);

				dataToUpdate.me.tasks[indexTaskToUpdate].position
					= itemUpdated.position;
				dataToUpdate.me.tasks[
					indexTaskToUpdate
				].section = oldSectionForItem;
			});

			itemsToUpdate.forEach((itemUpdated) => {
				const indexTaskToUpdate = dataToUpdate.me.tasks.findIndex(
					t => itemUpdated.id === t.id,
				);

				dataToUpdate.me.tasks[indexTaskToUpdate].position
					= itemUpdated.position;
				dataToUpdate.me.tasks[
					indexTaskToUpdate
				].section = sectionForItem;
			});

			cache.writeQuery({
				query: GET_ALL_TASKS,
				data: dataToUpdate,
			});
		}
	},
};
