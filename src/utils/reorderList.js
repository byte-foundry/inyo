const reorderList = (
	list,
	item,
	currentIndex,
	newIndex,
	positionPropertyName = null,
) => {
	const newList = [...list];
	let start;
	let end;

	// creation
	if (currentIndex === null) {
		// check to avoid duplicates
		if (
			typeof newIndex === 'number'
			&& list[newIndex]
			&& list[newIndex].id === item.id
		) {
			return list;
		}

		newList.splice(newIndex, 0, item);

		start = newIndex + 1;
		end = newList.length;
	}
	// remove
	else if (newIndex === null) {
		// check to avoid duplicates
		if (
			typeof currentIndex === 'number'
			&& list[currentIndex]
			&& list[currentIndex].id !== item.id
		) {
			return list;
		}

		newList.splice(currentIndex, 1);

		start = currentIndex;
		end = newList.length;
	}
	// update
	else {
		newList.splice(currentIndex, 1);
		newList.splice(newIndex, 1, item);

		start = currentIndex < newIndex ? currentIndex : newIndex;
		end = currentIndex < newIndex ? newIndex + 1 : currentIndex + 1;
	}

	if (positionPropertyName) {
		for (let i = start; i < end; i++) {
			newList[i] = {
				...newList[i],
				[positionPropertyName]: i,
			};
		}
	}

	return newList;
};

export default reorderList;
