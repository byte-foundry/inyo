import styled from '@emotion/styled';
import Portal from '@reach/portal';
import React, {useEffect, useRef, useState} from 'react';
import {useMutation, useQuery} from 'react-apollo-hooks';
import useOnClickOutside from 'use-onclickoutside';

import fbt from '../../fbt/fbt.macro';
import {BREAKPOINTS} from '../../utils/constants';
import {Loading} from '../../utils/content';
import {MARK_NOTIFICATIONS_AS_READ} from '../../utils/mutations';
import {
	Button,
	lightGrey,
	primaryGrey,
	primaryPurple,
	primaryRed,
	primaryWhite,
} from '../../utils/new/design-system';
import {GET_USER_NOTIFICATIONS} from '../../utils/queries';
import IconButton from '../IconButton';
import SidebarDashboardInfos from '../SidebarDashboardInfos';
import Tooltip from '../Tooltip';

const Dropdown = styled('div')`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	padding: 5px;
	position: absolute;
	width: 450px;
	box-shadow: 0 0 10px ${primaryGrey};
	border-radius: 3px;
	background: ${primaryWhite};

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		width: calc(100% - 10px);
	}
`;

const Icon = styled('button')`
	i {
		color: ${props => (props.someUnread ? primaryRed : '')} !important;
	}
`;

const AssistantActionsContainer = styled('div')`
	${props => (props.mobile
		? `
		display: none;
		@media (max-width: ${BREAKPOINTS.mobile}px) {
			display: block;
		}
	`
		: `
		display: block;
		@media (max-width: ${BREAKPOINTS.mobile}px) {
			display: none;
		}
	`)}
`;

const AssistantActions = ({mobile}) => {
	const icon = useRef();
	const dialogRef = useRef();
	const [isOpen, setOpen] = useState(false);
	const {data, refetch, loading} = useQuery(GET_USER_NOTIFICATIONS, {
		suspend: false,
		pollInterval: 1000 * 60,
	});
	const [markNotificationsAsRead] = useMutation(MARK_NOTIFICATIONS_AS_READ, {
		optimisticResponse: {
			marked: true,
		},
		update: (cache, {data: {marked}}) => {
			if (!marked) return;

			const queryData = cache.readQuery({
				query: GET_USER_NOTIFICATIONS,
				variables: {},
			});

			cache.writeQuery({
				query: GET_USER_NOTIFICATIONS,
				variables: {},
				data: {
					...queryData,
					me: {
						...queryData.me,
						notifications: queryData.me.notifications.map(n => ({
							...n,
							unread: false,
						})),
					},
				},
			});
		},
	});

	let unreadNumber = 0;

	if (!loading) {
		unreadNumber
			= data.me
			&& data.me.notifications.reduce(
				(sum, notification) => sum + (notification.unread ? 1 : 0),
				0,
			);
	}

	useEffect(() => {
		if (unreadNumber > 0) {
			document.title = `(${unreadNumber}) Inyo`;
		}
		else {
			document.title = 'Inyo';
		}

		return () => {
			document.title = 'Inyo';
		};
	}, [unreadNumber]);

	useOnClickOutside(dialogRef, () => {
		setOpen(false);
	});

	return (
		<AssistantActionsContainer mobile={mobile}>
			<Tooltip
				label={
					<fbt project="inyo" desc="assistant actions tooltip">
						Futures actions de votre assistant
					</fbt>
				}
			>
				<Icon
					someUnread={unreadNumber > 0}
					ref={icon}
					onClick={() => {
						setOpen(!isOpen);

						if (!isOpen) {
							refetch();
						}
					}}
				>
					<IconButton icon="sentiment_very_satisfied" size="small" />
				</Icon>
			</Tooltip>
			{isOpen && (
				<Portal>
					<Dropdown
						ref={dialogRef}
						aria-modal="true"
						tabIndex="-1"
						style={{
							top:
								icon.current.getBoundingClientRect().top
								+ icon.current.getBoundingClientRect().height,
							left: mobile
								? 0
								: icon.current.getBoundingClientRect().left,
							height: mobile
								? `calc(100% - ${icon.current.getBoundingClientRect()
									.top
										+ icon.current.getBoundingClientRect()
											.height
										+ 20}px`
								: undefined,
						}}
					>
						<SidebarDashboardInfos />
					</Dropdown>
				</Portal>
			)}
		</AssistantActionsContainer>
	);
};

export default AssistantActions;
