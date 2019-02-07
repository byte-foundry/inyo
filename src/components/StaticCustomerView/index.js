import React, {Component} from 'react';
import {Query} from 'react-apollo';

import {GET_PROJECT_DATA} from '../../utils/queries';
import {Loading} from '../../utils/content';

import ProjectDisplay from '../ProjectDisplay';

class StaticCustomerView extends Component {
	render() {
		const {projectId} = this.props;

		return (
			<Query
				query={GET_PROJECT_DATA}
				variables={{projectId}}
				fetchPolicy="network-only"
			>
				{({
					loading, error, data, refetch,
				}) => {
					if (loading) return <Loading />;
					if (error) throw error;

					const {project} = data;

					const timePlanned = project.sections.reduce(
						(timeSectionSum, section) => timeSectionSum
							+ section.items.reduce(
								(itemSum, item) => itemSum + item.unit,
								0,
							),
						0,
					);

					return (
						<ProjectDisplay
							project={project}
							issuer={data.project.issuer}
							project={data.project}
							timePlanned={timePlanned}
							refetch={refetch}
							mode="see"
							customerToken="preview"
							style={{pointerEvents: 'none', minHeight: 'auto'}}
						/>
					);
				}}
			</Query>
		);
	}
}

export default StaticCustomerView;
