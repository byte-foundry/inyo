import React, {useState, useRef, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {useQuery, useMutation} from 'react-apollo-hooks';
import styled from '@emotion/styled';
import useOnClickOutside from 'use-onclickoutside';

import NotificationPicto from '../../utils/icons/notifications.svg';
import NotificationItem from '../NotificationItem';
import {
	Button,
	primaryPurple,
	primaryGrey,
	primaryRed,
	primaryWhite,
} from '../../utils/new/design-system';
import {Loading} from '../../utils/content';
import {GET_USER_NOTIFICATIONS} from '../../utils/queries';
import {MARK_NOTIFICATIONS_AS_READ} from '../../utils/mutations';

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
`;

const Icon = styled('button')`
	background: ${props => (props.someUnread ? primaryRed : primaryGrey)};
	mask-image: url(${NotificationPicto});
	width: 26px;
	height: 26px;
	mask-repeat: no-repeat;
	mask-position: center;
	mask-size: cover;
	cursor: pointer;
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

const NotificationTrayButton = () => {
	const icon = useRef();
	const dialogRef = useRef();
	const containerElement = useRef(null);
	const [isOpen, setOpen] = useState(false);
	const {data, loading} = useQuery(GET_USER_NOTIFICATIONS, {
		suspend: false,
	});
	const markNotificationsAsRead = useMutation(MARK_NOTIFICATIONS_AS_READ, {
		optimisticResponse: {
			marked: true,
		},
		update: (cache, {data: {marked}}) => {
			if (!marked) return;

			const queryData = cache.readQuery({
				query: GET_USER_NOTIFICATIONS,
				variables: {},
			});

			data.me.notifications.forEach((n) => {
				n.unread = false; // eslint-disable-line
			});

			cache.writeQuery({
				query: GET_USER_NOTIFICATIONS,
				variables: {},
				data: queryData,
			});
		},
	});

	let someUnread = false;

	if (!loading) {
		someUnread = data.me.notifications.some(
			notification => notification.unread,
		);
	}

	useEffect(() => {
		if (!containerElement.current) {
			containerElement.current = document.createElement('div');
		}

		document.body.appendChild(containerElement.current);

		return () => {
			document.body.removeChild(containerElement.current);
		};
	});

	useOnClickOutside(dialogRef, () => {
		setOpen(false);
	});

	return (
		<>
			<Icon
				data-tip="Notifications liées à vos clients"
				someUnread={someUnread}
				ref={icon}
				onClick={() => setOpen(!isOpen)}
			/>
			{isOpen
				&& ReactDOM.createPortal(
					<Dropdown
						ref={dialogRef}
						aria-modal="true"
						tabIndex="-1"
						style={{
							top:
								icon.current.getBoundingClientRect().top
								+ icon.current.getBoundingClientRect().height,
							left: icon.current.getBoundingClientRect().left,
						}}
					>
						<MarkRead
							someUnread={someUnread}
							link
							onClick={() => markNotificationsAsRead()}
						>
							Tout marquer comme lu
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
								<p>Aucune notification.</p>
							</EmptyState>
						)}
					</Dropdown>,
					containerElement.current,
				)}
		</>
	);
};

export default NotificationTrayButton;
