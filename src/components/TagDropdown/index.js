import styled from '@emotion/styled';
import React from 'react';
import {useQuery} from 'react-apollo-hooks';
import {withRouter} from 'react-router-dom';

import {TAG_COLOR_PALETTE} from '../../utils/constants';
import {primaryPurple, primaryWhite} from '../../utils/new/design-system';
import {GET_USER_TAGS} from '../../utils/queries';
import {ArianneElemCreatable} from '../ArianneThread';

const ManageTagOption = styled('div')`
	position: absolute;
	margin-top: 10px;
	background: white;
	padding: 10px;
	width: 100%;
	box-sizing: border-box;
	border-radius: 4px;
	box-shadow: 0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1);
	top: 100%;
	cursor: pointer;

	&:hover {
		background: ${primaryPurple};
		color: ${primaryWhite};
	}
`;

const TagDropdown = (props) => {
	const {loading, data, errors} = useQuery(GET_USER_TAGS, {suspend: false});

	if (errors) throw errors;

	if (loading) return false;

	const onCreateOption = (name) => {
		const [colorBg, colorText] = TAG_COLOR_PALETTE[
			data.me.tags.length % TAG_COLOR_PALETTE.length
		].map(
			color => `#${color.map(p => p.toString(16).padStart(2, '0')).join('')}`,
		);

		props.onCreateOption(name, colorBg, colorText);
	};

	return (
		<ArianneElemCreatable
			list={data.me.tags}
			isMulti
			closeMenuOnSelect={false}
			supplementaryOption={
				<ManageTagOption
					onClick={() => {
						props.history.push({
							pathname: '/app/tags',
							search: props.location.search,
							state: {
								prevLocation: props.location,
								prevSearch:
									props.location.search
									|| props.location.state.prevSearch,
							},
						});
					}}
				>
					<fbt project="inyo" desc="manage tags">
						Gérer les tags
					</fbt>
				</ManageTagOption>
			}
			{...props}
			onCreateOption={onCreateOption}
		/>
	);
};

export default withRouter(TagDropdown);
