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
import NotificationItem from '../NotificationItem';
import Tooltip from '../Tooltip';

const Dropdown = styled('div')`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	margin-top: 10px;
	padding: 5px;
	position: absolute;
	width: 400px;
	box-shadow: 0 0 10px ${primaryGrey};
	border-radius: 3px;
	background: ${primaryWhite};

	@media (max-width: ${BREAKPOINTS}px) {
		width: calc(100% - 10px);
	}
`;

const Icon = styled('button')`
	i {
		color: ${props => (props.someUnread ? primaryRed : '')} !important;
	}
`;

const MarkRead = styled(Button)`
	color: ${primaryGrey};
	padding: 15px 10px;
	${props => (props.someUnread ? '' : 'display: none')};
	align-self: flex-end;

	&:focus {
		outline: 0;
	}
	&:hover {
		color: ${primaryPurple};
	}
`;

const List = styled('ul')`
	display: flex;
	flex-direction: column;
	margin: 0;
	padding: 0;
	min-height: 400px;
	max-height: 600px;
	overflow-y: auto;
`;

const Item = styled('li')`
	display: block;

	&:nth-child(odd) {
		background: ${lightGrey};
	}

	& + li {
		margin-top: 2px;
	}
`;

const EmptyState = styled('div')`
	flex: 1;
	display: flex;
	align-items: center;
	min-height: 400px;
	justify-content: center;
`;

const NotificationContainer = styled('div')`
	${props => (props.mobile
		? `
		display: none;
		@media (max-width: ${BREAKPOINTS}px) {
			display: block;
		}
	`
		: `
		display: block;
		@media (max-width: ${BREAKPOINTS}px) {
			display: none;
		}
	`)}
`;

const NotificationTrayButton = ({mobile}) => {
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
		<NotificationContainer mobile={mobile}>
			<Tooltip
				label={
					<fbt project="inyo" desc="notification tray button tooltip">
						Notifications liées à vos clients
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
					<IconButton icon="notifications" size="small" />
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
						<MarkRead
							someUnread={unreadNumber > 0}
							link
							onClick={() => markNotificationsAsRead()}
						>
							<fbt project="inyo" desc="mark all as read">
								Tout marquer comme lu
							</fbt>
						</MarkRead>
						{loading ? (
							<Loading />
						) : data.me.notifications.length > 0 ? (
							<List>
								{data.me.notifications.map(notification => (
									<Item key={notification.id}>
										<NotificationItem {...notification} />
									</Item>
								))}
							</List>
						) : (
							<EmptyState>
								<p>
									<fbt
										project="inyo"
										desc="no notification message"
									>
										Aucune notification.
									</fbt>
								</p>
							</EmptyState>
						)}
					</Dropdown>
				</Portal>
			)}
		</NotificationContainer>
	);
};

export default NotificationTrayButton;
