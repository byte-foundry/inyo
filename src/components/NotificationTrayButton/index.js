import React, {useState, useRef} from 'react';
import {useQuery, useMutation} from 'react-apollo-hooks';
import styled from '@emotion/styled';
import {DialogOverlay, DialogContent} from '@reach/dialog';

import Logo from '../../utils/icons/inyo-topbar-logo.svg';
import NotificationItem from '../NotificationItem';
import {Button, primaryGrey} from '../../utils/new/design-system';
import {GET_USER_NOTIFICATIONS} from '../../utils/queries';
import {MARK_NOTIFICATIONS_AS_READ} from '../../utils/mutations';

const Icon = styled('button')`
	background: url(${Logo});
	width: 26px;
	height: 26px;
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
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
		margin-top: 10px;
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

	return (
		<>
			<Icon ref={icon} onClick={() => setOpen(true)} />
			{isOpen && (
				<DialogOverlay
					isOpen
					style={{background: 'none'}}
					onDismiss={() => setOpen(false)}
				>
					<DialogContent
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
						<Button link onClick={() => markNotificationsAsRead()}>
							Marquer comme lu
						</Button>
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
					</DialogContent>
				</DialogOverlay>
			)}
		</>
	);
};

export default NotificationTrayButton;
