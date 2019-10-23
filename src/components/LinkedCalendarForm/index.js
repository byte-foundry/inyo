import styled from '@emotion/styled';
import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {BREAKPOINTS} from '../../utils/constants';
import {gray20, primaryWhite} from '../../utils/content';
import calendarIllus from '../../utils/images/bermuda-calendar.svg';
import {Button, P} from '../../utils/new/design-system';
import useAccount from '../../utils/useAccount';

const Illus = styled('img')`
	margin-right: 2rem;
	align-self: end;
	grid-row: 1 / 3;
`;

const FormContainer = styled('div')`
	flex: 1;
	display: grid;
	grid-template-columns: 1fr 2fr;
	align-items: center;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}
`;

const ProfileSection = styled('div')`
	background: ${primaryWhite};
	padding: 60px 40px;
	border: 1px solid ${gray20};

	display: flex;
	flex-direction: row;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		padding: 0;
		border: none;
	}
`;

const LinkedCalendarForm = () => {
	const [account, signedIn, userInfo, loading] = useAccount();

	return (
		<ProfileSection>
			<FormContainer>
				<Illus src={calendarIllus} />
				<div>
					<P>
						<fbt project="inyo" desc="connect your google calendar">
							Connectez votre google calendar pour voir les
							évènements dans votre dashboard
						</fbt>
					</P>
					{!loading
						&& (signedIn ? (
							<>
								<P>
									<fbt
										project="inyo"
										desc="your connected as"
									>
										Vous êtes connecté en tant que{' '}
										<fbt:param name="email">
											{userInfo.email}
										</fbt:param>
									</fbt>
								</P>
								<Button onClick={() => account.signOut()}>
									<fbt
										project="inyo"
										desc="sign out of google"
									>
										Déconnecter le compte google
									</fbt>
								</Button>
							</>
						) : (
							<>
								<Button onClick={() => account.signIn()}>
									<fbt
										project="inyo"
										desc="sign out of google"
									>
										Connecter un compte google
									</fbt>
								</Button>
							</>
						))}
				</div>
			</FormContainer>
		</ProfileSection>
	);
};

export default LinkedCalendarForm;
