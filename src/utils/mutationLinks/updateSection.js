import reorderList from '../reorderList';

const getProject = ({mutation, query}) => {
	const {project} = query.result;
	const updatedSection = mutation.result.data.updateSection;

	const oldSectionIndex = project.sections.findIndex(
		s => s.id === updatedSection.id,
	);

	if (oldSectionIndex < 0) return null;

	return {
		...query.result,
		project: {
			...project,
			sections: reorderList(
				project.sections,
				updatedSection,
				oldSectionIndex,
				updatedSection.position,
				'position',
			),
		},
	};
};

export default {
	getProjectData: getProject,
	getProjectInfos: getProject,
};
