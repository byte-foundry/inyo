import produce from 'immer';

export default {
	getProjectQuotes: ({mutation, query}) => {
		const quoteCreated = mutation.result.data.issueQuote;

		return produce(query.result, (draft) => {
			draft.project.quotes.push(quoteCreated);
		});
	},
};
