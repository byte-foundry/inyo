import React, {useState, useRef} from 'react';
import {useQuery, useMutation} from 'react-apollo-hooks';
import styled from '@emotion/styled';
import {DialogOverlay, DialogContent} from '@reach/dialog';

import Logo from '../../utils/icons/inyo-topbar-logo.svg';
import NotificationPicto from '../../utils/icons/notifications.svg';
import NotificationItem from '../NotificationItem';
import {
	Button,
	primaryPurple,
	primaryGrey,
	primaryRed,
} from '../../utils/new/design-system';
import {GET_USER_NOTIFICATIONS} from '../../utils/queries';
import {MARK_NOTIFICATIONS_AS_READ} from '../../utils/mutations';

const DialogContentWrap = styled(DialogContent)`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
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

const NotificationTrayButton = () => {
	const icon = useRef();
	const [isOpen, setOpen] = useState(false);
	const {data, loading, errors} = useQuery(GET_USER_NOTIFICATIONS, {
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

	return (
		<>
			<Icon
				data-tip="Notifications liées à vos clients"
				someUnread={someUnread}
				ref={icon}
				onClick={() => setOpen(true)}
			/>
			{isOpen && (
				<DialogOverlay
					isOpen
					style={{background: 'none'}}
					onDismiss={() => setOpen(false)}
				>
					<DialogContentWrap
						style={{
							margin: '0',
							padding: '5px',
							position: 'absolute',
							width: '400px',
							top:
								icon.current.getBoundingClientRect().top
								+ icon.current.getBoundingClientRect().height,
							left: icon.current.getBoundingClientRect().left,
							boxShadow: `0 0 10px ${primaryGrey}`,
							borderRadius: '3px',
						}}
					>
						<MarkRead
							someUnread={someUnread}
							link
							onClick={() => markNotificationsAsRead()}
						>
							Tout marquer comme lu
						</MarkRead>
						<List>
							{loading ? (
								<p>loading</p>
							) : (
								data.me.notifications.map(notification => (
									<Item key={notification.id}>
										<NotificationItem {...notification} />
									</Item>
								))
							)}
						</List>
					</DialogContentWrap>
				</DialogOverlay>
			)}
		</>
	);
};

export default NotificationTrayButton;
